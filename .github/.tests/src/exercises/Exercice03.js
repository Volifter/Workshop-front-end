/*
** Copyright (c) 2020 Volifter
*/

const parseColor = require("parse-color");

const Exercise = require("./Exercise");

class Exercice02 extends Exercise {
    constructor() {
        super("index.html", "Main .container");

        this.tests = [
            {
                statement: "second element in body is a .container div",
                action: async () => {
                    var div = this.body.children[1];

                    this.elements.div = div;
                    return div
                        && div.tagName == "DIV"
                        && this.hash([...div.classList].join(":")) == "9b180f05";
                },
                is_blocking: true
            },
            {
                statement: "it has a .centered div and a .notes div",
                action: async () => {
                    var div_a   = this.body.children[1].children[0];
                    var div_b   = this.body.children[1].children[1];

                    return div_a
                        && div_b
                        && div_a.tagName == "DIV"
                        && div_b.tagName == "DIV"
                        && this.hash([...div_a.classList].join(":")) == "423ca419"
                        && this.hash([...div_b.classList].join(":")) == "56d86a52";
                },
                is_blocking: true
            },
            {
                statement: "the first div has an input with a proper id and placeholder",
                action: async () => {
                    var input = this.body.children[1].children[0].children[0];

                    return input
                        && input.tagName == "INPUT"
                        && this.hash(input.id) == "5c1a2a6b"
                        && this.hash(input.placeholder) == "f8cf858c";
                },
                is_blocking: true
            },
            {
                statement: `the second div has three children with ".note" class`,
                action: async () => {
                    var divs = [...this.body.children[1].children[1].children];

                    return divs.every(el => this.hash([...el.classList].join(":")) == "d71c4f52");
                },
                is_blocking: true
            },
            {
                statement: "they all have an <h1> and a <p>",
                action: async () => {
                    var div = this.body.children[1].children[1];

                    return this.hash(Exercise.getStrucure(div)) == "a74d1f7c";
                },
                is_blocking: true
            },
            {
                statement: "their <h1>'s contents are correct",
                action: async () => {
                    var children = [...this.body.children[1].children[1].children];

                    return this.hash(children.map(
                        el => el.children[0].textContent.trim()
                    ).join(":")) == "5c7b7e86";
                }
            },
            {
                statement: "their <p>'s contents are correct",
                action: async () => {
                    var children = [...this.body.children[1].children[1].children];
                    var hashes = children.map(
                        el => this.hash(
                            el.children[1].textContent
                            .split("\n")
                            .map(l => l.trim())
                            .join("\n").trim()
                        )
                    ).join(":");

                    return hashes == "3ed7c995:0564d4be:849d0f13";
                }
            },
            {
                statement: ".container and .centered have correct styles",
                action: async () => {
                    var style           = this.selectCSSRule("78c37492");
                    var hashed_style    = this.hash(style);
                    var padding         = this.uncircularizeValues(
                        "padding",
                        this.selectCSSRule("203ba4d7")
                    );

                    return this.hash(
                            Object.values(padding).join(":")
                        ) == "54297e70"
                        && hashed_style["f109656b"] == "bbd8e1a9"
                }
            },
            {
                statement: "#search-input has correct styles",
                action: async () => {
                    var style           = this.selectCSSRule("6a774080");
                    var hashed_style    = this.hash(style);
                    var margin          = this.uncircularizeValues(
                        "margin", style
                    );
                    var padding         = this.uncircularizeValues(
                        "padding", style
                    );
                    var border_values   = style.border.split(" ").sort()

                    return this.hash(
                            Object.values(margin).join(":")
                        ) == "83b18262"
                        && this.hash(
                            Object.values(padding).join(":")
                        ) == "7cbfd36e"
                        && hashed_style["9379e333"] == "7788f5a8"
                        && hashed_style["0c2b884f"] == "a0bcfc58"
                        && hashed_style["4d38a2d1"] == "293d6ac4"
                        && hashed_style["5006a8bc"] == "0509fa30"
                        && this.hash(border_values[0]) == "4b80a8d8"
                        && this.hash(parseColor(border_values[1]).hex) == "1a272a94"
                        && this.hash(border_values[2]) == "f67d2ce5"
                        && hashed_style["2ec03e7e"];
                }
            },
            {
                statement: "#search-input has correct styles on focus",
                action: async () => {
                    var style = this.selectCSSRule("f1dcfea9");

                    style["border-color"] = parseColor(style["border-color"]).hex;

                    var hashed_style = this.hash(style);

                    return hashed_style["41596466"] == "7c61b984"
                        && hashed_style["06a89083"];
                }
            },
            {
                statement: "The .notes container has correct styles",
                action: async () => {
                    var style           = this.selectCSSRule("cf45de96");
                    var hashed_style    = this.hash(style);

                    return hashed_style["e3a45588"] == "3a25b4ff"
                        && hashed_style["815f3d46"] == "bbd8e1a9"
                        && (
                            hashed_style["6ed97d1f"] == "5714fa89"
                            || hashed_style["c96b1369"] == "5714fa89"
                        );
                }
            },
            {
                statement: "Each .note has correct styles",
                action: async () => {
                    var style           = this.selectCSSRule("d5e0da33");
                    var hashed_style    = this.hash(style);
                    var margin          = this.uncircularizeValues(
                        "margin", style
                    );
                    var padding         = this.uncircularizeValues(
                        "padding", style
                    );

                    return this.hash(
                            Object.values(margin).join(":")
                        ) == "6d066d8b"
                        && this.hash(
                            Object.values(padding).join(":")
                        ) == "32d0dd70"
                        && hashed_style["a18e25ff"] == "944085d5"
                        && hashed_style["4d38a2d1"] == "8bdd4e63"
                        && hashed_style["06a89083"]
                }
            },
            {
                statement: "Each .note's title has correct styles",
                action: async () => {
                    var style           = this.selectCSSRule("e7f598ba");
                    var hashed_style    = this.hash(style);
                    var margin          = this.uncircularizeValues(
                        "margin", style
                    );
                    var padding          = this.uncircularizeValues(
                        "padding", style
                    );

                    return this.hash(
                            Object.values(margin).join(":")
                        ) == "ca9879b7"
                        && this.hash(Object.values(padding)[2]) == "2a645e6e"
                        && hashed_style["9379e333"] == "3687108a"
                        && hashed_style["8777e66e"]
                }
            },
            {
                statement: "Each .note's content has correct styles",
                action: async () => {
                    var style           = this.selectCSSRule("d863d5c7");
                    var hashed_style    = this.hash(style);

                    return hashed_style["6da89e8e"] == "944085d5"
                        && hashed_style["48028b3f"] == "7d1b0522"
                        && hashed_style["ba488115"] == "bcf57df3"
                }
            }
        ]
    }
}


module.exports = Exercice02;
