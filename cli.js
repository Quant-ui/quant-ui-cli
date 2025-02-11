#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { promisify } from "util";
import { execSync } from "child_process";
import fetch from "node-fetch";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const COMPONENTS_REPO = process.env.COMPONENTS_REPO;

if (!COMPONENTS_REPO) {
    console.error(chalk.red("❌ Error: COMPONENTS_REPO is not set in .env file"));
    process.exit(1);
}

// Required dependencies for components
const REQUIRED_DEPENDENCIES = ["class-variance-authority"];

async function checkAndInstallDependencies() {
    console.log("📦 Checking for required dependencies...");

    // Get installed dependencies
    const installedDeps = Object.keys(
        JSON.parse(execSync("npm ls --json || echo '{}'", { encoding: "utf8" })).dependencies || {}
    );

    const missingDeps = REQUIRED_DEPENDENCIES.filter(dep => !installedDeps.includes(dep));

    if (missingDeps.length > 0) {
        console.log(chalk.yellow(`🔧 Installing missing dependencies: ${missingDeps.join(", ")}`));
        execSync(`npm install ${missingDeps.join(" ")}`, { stdio: "inherit" });
        console.log(chalk.green("✅ Dependencies installed successfully!"));
    } else {
        console.log(chalk.green("✅ All required dependencies are already installed."));
    }
}

async function downloadComponent(componentName) {
    console.log(chalk.blue(`🛠 Creating ${componentName} component...`));

    const componentPath = path.join(process.cwd(), "src/components/ui", componentName);

    try {
        await mkdir(componentPath, { recursive: true });

        const files = [`${componentName}.tsx`, `${componentName}.css`];

        for (const file of files) {
            const url = `${COMPONENTS_REPO}/${componentName}/${file}`;
            const response = await fetch(url);

            if (!response.ok) {
                console.error(chalk.red(`❌ Failed to fetch ${file} for ${componentName}. Status: ${response.status}`));
                return;
            }

            const content = await response.text();
            await writeFile(path.join(componentPath, file), content);
        }

        console.log(chalk.green(`✅ ${componentName} installed successfully!`));

        // Install required dependencies after component installation
        await checkAndInstallDependencies();
    } catch (error) {
        console.error(chalk.red(`❌ Error installing component:`), error);
    }
}

async function removeComponent(componentName) {
    const componentPath = path.join(process.cwd(), "src/components/ui", componentName);

    if (!fs.existsSync(componentPath)) {
        console.log(chalk.red(`❌ Component "${componentName}" is not installed.`));
        process.exit(1);
    }

    fs.rmSync(componentPath, { recursive: true, force: true });
    console.log(chalk.green(`✅ Removed ${componentName} component!`));
}

async function listComponents() {
    console.log(chalk.blue("📦 Fetching available components..."));

    try {
        const response = await fetch(`${COMPONENTS_REPO}/components.json`);
        if (!response.ok) {
            console.error(chalk.red("❌ Failed to fetch component list."));
            return;
        }

        const components = await response.json();
        console.log(chalk.green("Available Components:"));
        components.forEach(comp => console.log(`- ${comp}`));
    } catch (error) {
        console.error(chalk.red("❌ Error fetching component list:"), error);
    }
}

async function main() {
    const [, , command, componentName] = process.argv;

    switch (command) {
        case "add":
            if (!componentName) {
                console.log(chalk.red("❌ Please specify a component to install. Example:"));
                console.log("   npx quant add button");
                process.exit(1);
            }
            await downloadComponent(componentName);
            break;

        case "remove":
            if (!componentName) {
                console.log(chalk.red("❌ Please specify a component to remove."));
                process.exit(1);
            }
            await removeComponent(componentName);
            break;

        case "list":
            await listComponents();
            break;

        default:
            console.log(chalk.red(`❌ Unknown command "${command}".`));
            console.log("Available commands: add | remove | list");
    }
}

main();
