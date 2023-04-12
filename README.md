![Spector AI](https://user-images.githubusercontent.com/64434514/231593196-a893acb3-3e39-4d15-9426-03d4a14b20e6.png)

# Spector AI

> Description made with **GPT 3.5**

Discover the power of **Spector AI**! 🔮 An awesome tool to **generate tests**, **documentation** and **code explanations** in any programming language 🤯 It's magical! Simply install [Node.js](https://nodejs.org), create an [Open AI account](https://platform.openai.com/account), and add your environment variables. And ready! 🚀

## Features

- 🔭 Compatible with any programming language.
- 🧪 Test generation.
- 📙 Documentation generation.
- 🧮 Generation of functions.
- 🗒️ Code explanation.
- ⚡ Easy to configure and integrate.
- 🛡️ Written in Typescript.
- 👨🏻‍💻 Community driven.

## Requirements

- Have [Node.js](https://nodejs.org) installed.
- Create an account in [Open AI](https://openai.com/).

## Installation

```bash
npm install spectorai -g
```

## Setup

Before using the tool it is necessary to add environment variables.

**Linux or Mac**

```bash
export OPENAI_API_KEY=
```

**Windows**

```bash
set OPENAI_API_KEY=
```

## Getting Started

Once the above steps are completed run the following command:

```bash
spectorai
```

You will be shown a screen like this:

![Spector AI CLI](https://res.cloudinary.com/dlkfpx8lb/image/upload/v1680964212/spectorai_z5nmbq.png)

> Don't worry if you don't see the same options, we're working on it.

Now select the option you want to use and continue to fill in the information.

## Custom environment variables

**Spector AI** is ready to adapt to your needs in case the default settings are not sufficient. The following environment variables are available:

- `OPENAI_API_KEY`: You can get the API KEY at the following link https://platform.openai.com/account/api-keys
- `OPENAI_MIN_TOKENS`: Specifies the minimum number of characters to generate a response. By default its value is `255`

**Linux & Mac**

```bash
export OPENAI_API_KEY=

export OPENAI_MIN_TOKENS=
```

**Windows**

```bash
set OPENAI_API_KEY=

set OPENAI_MIN_TOKENS=
```

## Supported programming languages

**Spector AI** currently supports most programming languages. How is this possible? The question is that **Spector AI extracts the extension** of the file on which we want to perform a certain task. Either to generate tests, documentation or code explanations.

## Limitations

Because the **GPT 3.5** model supports a **maximum of 4,096 tokens** (includes prompt + output), it is possible that your tasks (test creation, documentation, etc) will not be fully completed due to this limitation. That's why we're looking forward to GPT 4. 😃
