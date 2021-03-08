/*
** Copyright (c) 2020 Volifter
*/

const parseColor = require("parse-color");

const Exercise = require("./Exercise");

class Exercice01 extends Exercise {
    constructor() {
        super("index.html", "<head> section");

        this.tests = [
            {
                statement: "page's title is \"Epinotes\"",
                action: async () => {
                    var el = [...this.head.children]
                        .filter(el => el.tagName == "TITLE")[0];

                    return el && this.hash(el.text) == "822cd09f";
                }
            },
            {
                statement: "head has the right favicon",
                action: async () => {
                    var el = [...this.head.children]
                        .filter(
                            el => el.tagName == "LINK"
                                && (el.rel || "").split(" ").includes("icon")
                        )[0];

                    return el && this.hash(el.href.slice(-20)) == "96d2ee68";
                }
            },
            {
                statement: "head has the right stylesheet",
                action: async () => {
                    var el = [...this.head.children]
                        .filter(
                            el => el.tagName == "LINK" && el.rel == "stylesheet"
                        )[0];

                    return el && this.hash(el.href.slice(-19)) == "b298f415";
                }
            },
            {
                statement: "head has the right script",
                action: async () => {
                    var el = [...this.head.children]
                        .filter(
                            el => el.tagName == "SCRIPT"
                        )[0];

                    return el && this.hash(el.src.slice(-16)) == "486d758d";
                }
            }
        ]
    }
}

module.exports = Exercice01;
