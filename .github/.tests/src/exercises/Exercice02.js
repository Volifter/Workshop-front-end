/*
** Copyright (c) 2020 Volifter
*/

const parseColor = require("parse-color");

const Exercise = require("./Exercise");

class Exercice02 extends Exercise {
    constructor() {
        super("index.html", "Nav menu");

        this.tests = [
            {
                statement: "first element in body is a nav",
                action: async () => {
                    var nav = this.body.children[0];

                    this.elements.nav = nav;
                    return nav && nav.tagName == "NAV";
                },
                is_blocking: true
            },
            {
                statement: "it has 5 children",
                action: async () => {
                    var {nav} = this.elements;

                    return [...nav.children].length == 5;
                },
                is_blocking: true
            },
            {
                statement: "they're all anchors (<a>)",
                action: async () => {
                    var {nav} = this.elements;

                    return [...nav.children].every(el => el.tagName == "A");
                },
                is_blocking: true
            },
            {
                statement: "the first one holds the logo",
                action: async () => {
                    var el = this.elements.nav.children[0].children[0];

                    return el && this.hash(
                        `${el.src.slice(-17)}:${el.alt}`
                    ) == "6c429ea4";
                }
            },
            {
                statement: "the others have appropriate names",
                action: async () => {
                    var {nav} = this.elements;

                    return nav.children
                        && this.hash(
                            [...nav.children]
                                .slice(1)
                                .map(el => el.textContent)
                                .join(":")
                        ) == "58b48fe2";
                }
            },
            {
                statement: "the four last are \".item\"'s and have no ids",
                action: async () => {
                    var {nav} = this.elements;

                    return this.hash(
                        [...nav.children]
                            .map(el => [...el.classList].join(",") + "#" + el.id)
                            .join(":")
                    ) == "d6a3638f";
                }
            },
            {
                statement: "\".item\"'s in nav have correct styles",
                action: async () => {
                    var style   = this.selectCSSRule("e0ed5ea3");
                    var padding = this.uncircularizeValues("padding", style);

                    style.color = parseColor(style.color).hex;

                    var hashed_style = this.hash(style);

                    return style
                        && hashed_style["9379e333"] == "7788f5a8"
                        && hashed_style["389c8adb"] == "b9d0fe9b"
                        && hashed_style["60ce9b98"] == "0509fa30"
                        && this.hash(
                            Object.values(padding).join(":")
                        ) == "d17dd8c1";
                }
            },
            {
                statement: "last \".item\" in nav has a special color and "
                    + "is aligned to the right",
                action: async () => {
                    var style = this.selectCSSRule("1ad69f59");

                    style.color = parseColor(style.color).hex;

                    return this.hash(
                        Object.entries(style)
                            .sort()
                            .map(v => v.join(":"))
                            .join(";")
                    ) == "d1466046";
                }
            },
        ]
    }
}

module.exports = Exercice02;
