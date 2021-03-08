/*
** Copyright (c) 2020 Volifter
*/

const fs        = require("fs");
const path      = require("path");
const crypto    = require("crypto");

const jsdom     = require("jsdom");
const {JSDOM}   = jsdom;

const COLORS = {
    RED:        "\x1b[31m",
    GREEN:      "\x1b[32m",
    MAGENTA:    "\x1b[35m",
    RESET:      "\x1b[0m"
};
const SALT = "L4b@sT3k_rUl3S!!";

class Exercise {
    constructor(file_path, name) {
        this.name       = name;
        this.results    = {total: 0, passed: 0};
        this.dom        = Exercise.getDom(
            path.resolve(path.join("../../www/", file_path))
        );
        this.window     = this.dom.window || {};
        this.document   = this.dom.window.document || {};
        this.head       = this.dom.window.document.head;
        this.body       = this.dom.window.document.body;
        this.elements   = {};
        this.tests      = [];

        if (!this.window)
            throw Error("No window in file");
        if (!this.document)
            throw Error("No document in file");
        if (!this.head)
            throw Error("Missing <head> tag");
        if (!this.body)
            throw Error("Missing <body> tag");
    }

    static getDom(file_path) {
        return new JSDOM(
            "" + fs.readFileSync(file_path),
            {
                resources:  "usable",
                url:        `file://${path.resolve("../../www")}/`,
                runScripts: "dangerously"
            }
        );
    }

    static getStrucure(element) {
        var children = [...element.children].map(Exercise.getStrucure);

        return element.tagName + (
            children.length ? `: [${children.join(", ")}]` : ''
        )
    }

    static disambiguateCSSValue(val) {
        return val.length > 1
            && (val == "none" || val[0] == "0" && isNaN(val[1]))
            ? "0"
            : val;
    }

    selectCSSRule(selector) {
        var style = (
                [...this.document.styleSheets[0].cssRules].find(rule =>
                    this.hash(rule.selectorText) == selector
                ) || {}
            ).style;

        return style
            ? Object.fromEntries(
                Array.from(style).map(key => [
                    key, Exercise.disambiguateCSSValue(style[key])
                ])
            )
            : {};
    }

    uncircularizeValues(name, style) {
        var values = (style[name] || "")
            .split(" ")
            .filter(Boolean)
            .map(Exercise.disambiguateCSSValue);
        var obj = {
            [name + "-top"]:    null,
            [name + "-right"]:  null,
            [name + "-bottom"]: null,
            [name + "-left"]:   null
        };

        if (values.length == 1) {
            obj[name + "-top"] = obj[name + "-right"] = obj[name + "-bottom"] =
                obj[name + "-left"] = values[0];
        }
        if (values.length == 2) {
            obj[name + "-top"]      = obj[name + "-bottom"] = values[0];
            obj[name + "-right"]    = obj[name + "-left"]   = values[1];
        }
        if (values.length == 4) {
            obj = Object.fromEntries(
                Object.keys(obj).map((key, i) => [key, values[i]])
            )
        }
        for (let key of Object.keys(obj)) {
            if (style[key] !== undefined)
                obj[key] = style[key];
        }
        return obj;
    }

    hash(val) {
        if (typeof val == "object") {
            var obj = {};

            for (let key in val)
                obj[this.hash(key)] = this.hash(val[key]);
            return obj;
        }
        return crypto.createHash("md5")
            .update(SALT + val)
            .digest("hex")
            .substr(0, 8);
    }

    assert(statement, has_passed = false) {
        var prefix = [`${COLORS.RED}𐄂`, `${COLORS.GREEN}✓`][+has_passed];

        console.log(" ", prefix, statement, COLORS.RESET);
        this.results.passed += has_passed;
        return has_passed;
    }

    assertHash(statement, value, hash) {
        return this.assert(statement, this.hash(value) == hash);
    }

    async run() {
        this.results.total = this.tests.length;
        console.log(`\n${this.name}:`);
        for (let test of this.tests) {
            try {
                var result = !!await test.action();
            } catch (e) {
                var result = false;
            }
            if (!this.assert(test.statement, result) && test.is_blocking) {
                console.log(
                    "   ",
                    `${COLORS.MAGENTA}(remaining tests skipped)${COLORS.RESET}`
                );
                return this.results;
            }
        }
        return this.results;
    }
}

module.exports = Exercise;
