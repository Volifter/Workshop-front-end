/*
** Copyright (c) 2020 Volifter
*/

const parseColor = require("parse-color");

const Exercise = require("./Exercise");

class Exercice02 extends Exercise {
    constructor() {
        super("index.html", "JavaScript");

        this.tests = [
            {
                statement: `document has an input "#search-input" and three ".notes" with <h1> and <p>`,
                action: async () => {
                    this.elements.input = this.document.getElementById("search-input");
                    this.elements.notes = [...this.document.querySelectorAll(".note")];

                    return this.elements.input
                        && this.elements.input.tagName == "INPUT"
                        && this.elements.notes.length == 3
                        && this.elements.notes[0].parentElement
                        && this.hash(
                            Exercise.getStrucure(
                                this.elements.notes[0].parentElement
                            )
                        ) == "a74d1f7c";
                },
                is_blocking: true
            },
            {
                statement: `".note" divs have proper contents`,
                action: async () => {
                    var hashes = this.elements.notes.map(
                        el => this.hash(
                            el.children[1].textContent
                            .split("\n")
                            .map(l => l.trim())
                            .join("\n").trim()
                        )
                    ).join(":");

                    return hashes == "3ed7c995:0564d4be:849d0f13";
                },
                is_blocking: true
            },
            {
                statement: `Search for no query`,
                action: async () => this.testInput(
                    "",
                    "7d2be6eb",
                ),
                is_blocking: true
            },
            {
                statement: `Search for "fish"`,
                action: async () => this.testInput(
                    "fish",
                    "c90913a6"
                )
            },
            {
                statement: `Search for "so"`,
                action: async () => this.testInput(
                    "so",
                    "f7ad312d"
                )
            },
            {
                statement: `Search for "so long"`,
                action: async () => this.testInput(
                    "so long",
                    "15c0f613"
                )
            },
            {
                statement: `Search for unexisting word`,
                action: async () => this.testInput(
                    "Supercalifragilisticexpialidocious",
                    "dd658d77"
                )
            },
            {
                statement: `Search for empty query (spaces only)`,
                action: async () => this.testInput(
                    "    ",
                    "8058ab36"
                )
            },
            {
                statement: `Search for word in note title`,
                action: async () => this.testInput(
                    "illusion",
                    "2e239ba9"
                )
            },
            {
                statement: `Search for word in note contents`,
                action: async () => this.testInput(
                    "doubly",
                    "c01ed4c3"
                )
            },
            {
                statement: `Search for words in both title and contents`,
                action: async () => this.testInput(
                    "Mammal panic",
                    "d24b5db0"
                )
            },
            {
                statement: `Search for case-transformed word`,
                action: async () => this.testInput(
                    "dOlPhInS",
                    "1e028bae"
                )
            },
            {
                statement: `Search for punctuation`,
                action: async () => this.testInput(
                    "– !",
                    "dccc38eb"
                )
            },
            {
                statement: `Mixed search #0`,
                action: async () => this.testInput(
                    "  DoLpHiN      planet !!!!  ",
                    "8afe2358"
                )
            },
            {
                statement: `Mixed search #1`,
                action: async () => this.testInput(
                    "LuNCh   tIme !!! !!  ",
                    "bd6f37d4"
                )
            },
            {
                statement: `Mixed search #2`,
                action: async () => this.testInput(
                    "   SwEet    illusion",
                    "3ef59762"
                )
            },
        ]
    }

    testInput(value, hash) {
        this.elements.input.value = value;
        var {log, warn, error} = console;
        console.log = console.warn = console.error = () => {};
        this.elements.input.dispatchEvent(new this.window.Event("input"));
        Object.assign(console, {log, warn, error});
        return this.hash(this.elements.notes
                .map(el => el.style["visibility"])
                .concat(value)
                .join(":")
            ) == hash;
    }
}

module.exports = Exercice02;
