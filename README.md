# GitHub Repository to Markdown

A Node.js CLI tool that converts a GitHub repository zip file into a single markdown file containing the file paths and code.

## Usage

1. Install Node.js (version 14 or higher) on your machine.

2. Download the repository zip file from GitHub.

3. Run the following command:

```bash
node index.js <zip_path> <output_path>
```

Replace `<zip_path>` with the path to the downloaded zip file and `<output_path>` with the desired path for the generated markdown file.

1. The markdown file will be created at the specified output path.

## Testing

To run the tests, use the following command:

```bash
npm test
```

## CI

The project includes a GitHub Actions workflow for continuous integration. It will automatically run the tests and package the tool on every push to the repository.

