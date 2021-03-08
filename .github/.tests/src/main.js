/*
** Copyright (c) 2020 Volifter
*/

const fs = require("fs");

const SUMMARY_FILE = process.env.SUMMARY_FILE || "summary.json";
const EXERCICES = new Array(4)
    .fill()
    .map((_, i) => i + 1 + "")
    .filter(i => process.argv.includes("--testsuite-" + i))
    .map(
        i => require("./exercises/Exercice" + `${i}`.padStart(2, 0))
    );

class Main {
    static async getSummary() {
        try {
            var {total, passed} = JSON.parse(
                await fs.promises.readFile(SUMMARY_FILE)
            );

            return {total: +total || 0, passed: +passed || 0};
        } catch (e) {
            return {total: 0, passed: 0};
        }
    }

    static async saveSummary(new_summary) {
        var summary = await Main.getSummary();

        summary.total   += new_summary.total;
        summary.passed  += new_summary.passed;
        await fs.promises.writeFile(SUMMARY_FILE, JSON.stringify(summary));
    }

    static async runTests(summary) {
        if (!EXERCICES.length)
            return;
        console.log("Executing tests...");
        for (let Exercise of EXERCICES) {
            var result = await new Promise((resolve, reject) => {
                try {
                    const ex = new Exercise();

                    ex.dom.window.addEventListener("load", () => {
                        ex.run().then(resolve, reject);
                    });
                } catch (e) {
                    console.log("Failed to load exercise:", e.message);
                }
            });
            summary.total += result.total;
            summary.passed += result.passed;
        }
        console.log();
    }

    static async run(is_summary_only) {
        var summary = {total: 0, passed: 0};

        if (is_summary_only)
            summary = await Main.getSummary();
        else
            await Main.runTests(summary);
        if (!summary.total && !is_summary_only)
            return 1;
        console.log("===", "SUMMARY", "===");
        console.log("", summary.total, "tests run");
        console.log(
            "",
            summary.passed,
            `test${summary.passed == 1 ? "" : "s"} passed`
        );
        console.log(
            "Score:",
            (summary.passed / summary.total * 100 || 0).toFixed(2) + "%"
        );
        if (!is_summary_only)
            await Main.saveSummary(summary);
        else
            fs.promises.access(SUMMARY_FILE).then(
                fs.promises.unlink(SUMMARY_FILE),
                () => {}
            );
        return summary.passed < summary.total;
    }
}

Main.run(process.argv.includes("--summary")).then(async exit_status => {
    process.exit(exit_status);
})
