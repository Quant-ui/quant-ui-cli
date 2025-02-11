#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { promisify } from "util";
import fetch from "node-fetch";
import chalk from "chalk";

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

const COMPONENTS_REPO = "https://raw.githubusercontent.com/NikolaD93/tst/main/src/components/ui";

async function downloadComponent(componentName) {
    console.log(chalk.blue(`Fetching ${componentName} component...`));

    const componentPath = path.join(process.cwd(), "src/components/ui", componentName);

    try {
        await mkdir(componentPath, { recursive: true });

        const files = [`${componentName}.tsx`, `${componentName}.css`];

        for (const file of files) {
            const url = `${COMPONENTS_REPO}/${componentName}/${file}`;
            console.log(chalk.yellow(`Downloading: ${url}`)); // Debugging

            const response = await fetch(url);

            if (!response.ok) {
                console.error(chalk.red(`Failed to fetch ${file} for ${componentName}. Status: ${response.status}`));
                return;
            }

            const content = await response.text();
            await writeFile(path.join(componentPath, file), content);
        }

        console.log(chalk.green(`${componentName} installed successfully!`));
    } catch (error) {
        console.error(chalk.red("Error installing component:"), error);
    }
}

async function main() {
    const [, , command, componentName] = process.argv;

    if (command === "add" && componentName) {
        await downloadComponent(componentName);
    } else {
        console.log(chalk.yellow("Usage: npx qnt-ui add <component>"));
    }
}

main();
