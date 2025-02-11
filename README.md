# QuantUI CLI - A Minimalistic UI Component Library for React

QuantUI CLI is a command-line tool that allows React developers to quickly install lightweight, CSS-only UI components into their projects. Instead of installing an entire UI library, you can fetch only the components you need, keeping your project clean and optimized.

### ⚠️ Note: This CLI is designed specifically for React projects. The components are built using React and will not work in plain HTML or other frameworks.

## ✨ Features

- Install Only What You Need – No bloated dependencies, just fetch the required components.
- CSS-Only Components – Minimalistic and highly customizable styles without JavaScript overhead.
- Zero Configuration – Works instantly in any project structure.
- Easy-to-Use CLI – Simple commands for adding, listing, and removing components.

## 📦 Installation & Usage

QuantUI CLI works without installation. Simply use npx to execute commands.

### Add a Component

To install a specific component (e.g., button), run:

```bash
npx quant add button
```

This will copy the Button component into your project’s components/ui directory.

### List Available Components

To view a list of available components, you can run:

```bash
npx quant list
```

### Remove Specific Component

This will remove the component you specify (e.g., button) from your project’s components/ui directory.

```bash
npx quant remove button
```

### Usage

Once the components are installed, you can use them in your React or HTML-based projects. Here’s how to use the Button component:

```bash
import { Button } from '@/components/ui/button';

const App = () => (
  <div>
    <Button variant="primary" size="large" onClick={() => alert('Clicked!')}>
      Primary Button
    </Button>
  </div>
);
```

🔗 Contributing
We welcome contributions! If you'd like to add new components or improve the CLI, feel free to fork the repo and submit a pull request.

📜 License
QuantUI is open-source and licensed under the MIT License.

Let me know if you need further refinements! 🚀
