// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as template from "./player.template.html";

type VideoSource = {
    label: string;
    videos: string[];
    width: number;
    muted?: boolean;
};

const internalVideoSources: VideoSource[] = [
    {
        label: "Subway Surfers",
        videos: ["RPReplay_Final1680875953.mp4"],
        width: 300,
        muted: true,
    },
];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand("subway-surfers.overstimulate", () => {
		const configuration = vscode.workspace.getConfiguration();
		const userVideoSources: VideoSource[] = configuration.get("subway-surfers.customSources") || [];
		const serverUrl: string = configuration.get("subway-surfers.serverUrl") || "";
		const videoSources = internalVideoSources.concat(userVideoSources);
        const items: vscode.QuickPickItem[] = videoSources.map((source) => {
            return {
                label: source.label,
                alwaysShow: true,
            };
        });

        vscode.window.showQuickPick(items, { placeHolder: "Choose your overstimulation method" }).then((selection) => {
            if (!selection) {
                return;
            }

            const column = {
                viewColumn: vscode.ViewColumn.Beside,
                preserveFocus: true,
            };

            const options = { enableScripts: true };

            const panel = vscode.window.createWebviewPanel(
                "subway-surfers.video",
                "This code boring ah hell",
                column,
                options
            );

            const source = videoSources.find((source) => source.label === selection.label)!;
            const html = template
                .replace(/WIDTH/g, source.width.toString())
                .replace(/VIDEOS/g, JSON.stringify(source.videos.sort(() => 0.5 - Math.random()))) // Shuffle the videos array
				.replace(/MUTED/g, source.muted ? "muted" : "")
				.replace(/SERVER_URL/g, JSON.stringify(serverUrl))
                .trim();

            panel.reveal();
            panel.webview.html = html;
        });
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
