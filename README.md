********************************
Eendraadschema Community edition
********************************

## Purpose

Design and draw a one-wire diagram as enforced by the Belgian AREI legislation.
Source code written in Typescript, transpiled to Javascript and run in a browser.

## Build

Ensure you have vite installed, usually this is done using 
```npm install vite@latest```

Then run
```npm run dev```

Open the indicated url in a browser window.

A single file version can be built using
```npm run build```

This will create a single "`index.html`" file in the "`dist`"-folder
The "`index.html`"-file will still need all the resources in the root folder so must be renamed and
copied into the root-folder to get a working application.
The default build configuration is only provided as an example.

## Local MCP assistant bridge

An external MCP client can inspect the live electrical graph and submit a reviewed change proposal.
This is deliberately local-only. The browser asks for approval before applying a proposal; accepted proposals are one undoable document change.

The easy way, one command that starts everything in the right order:

```npm run dev:mcp```

It starts the bridge (`ws://127.0.0.1:9234`), the MCP HTTP server (`http://127.0.0.1:9235/mcp`) and
the Vite dev server (`http://localhost:5173`), then prints the URL to open, which ends in `?mcp=on`.
Ctrl+C stops all three. Point the MCP client at `http://127.0.0.1:9235/mcp` (type `http`).

Things that go wrong if you start the pieces by hand:

- The browser tab connects to the bridge **once, at page load**, and never retries. Start the bridge first;
  if it is restarted afterwards, reload the tab.
- The tab must be opened with `?mcp=on`, otherwise it never connects.
- An MCP client configured for HTTP needs `npm run mcp:http` running too, not only `npm run mcp:serve`.
- `dev:mcp` uses a fixed port (default 5173, `EDS_DEV_PORT` to change) and fails if it is taken, so the URL it prints is always right.

Manual alternative: `npm run mcp:serve`, open the app with `?mcp=on`, then have the MCP client run `npm run mcp:stdio`
(or `npm run mcp:http` for a long-running HTTP server).

## Product and user-flow documentation

The detailed Dutch/Flemish product vision is maintained in
[`docs/gebruiksvisie`](docs/gebruiksvisie/README.md). It describes the intended
end-to-end user flow, the relationship between the three views, MCP-assisted
editing, and the decisions that should be revisited as the application evolves.

## License

See LICENSE.md

## Frequent questions

### Do you have commercial plans?

No.

For me this is 100% a hobby-activity that I work on when and how I see fit.
It helps me to learn new skills and keep the brain cells activated.
I prefer to manage this project with as little constraints as possible. 

Any commercialisation would interfere with the freedom that I currently enjoy.
I therefore have no plans in that direction.

### Can I contribute?

Thanks for asking, but at present I manage this as a 1-person project and intend to keep
it that way for the foreseeable time.

The code is supplied as is for people that can use parts of it in other GPL projects.
An added benefit is that having the code out in the open provides people with a guarantee
that they will always be able to open and edit their EDS files, even if my own website
where I host this tool would go down for some reason.

I cannot state with 100% certainty that I will never change my mind and
accept contributions in the future, but don't start working on this code with that specific end-state in mind.
I hate to say no, but I most probably will.

### Have you considered a framework like Angular, React, ...

Yes, and one day that might actually happen, but that day is not today.
Some earlier experiments were not entirely convincing as far as performance is concerned
and have reduced my appetite.

In addition, given the small size of the project, the old-school javascript-approach is at present
not holding me back in any way.  If the project grows significantly larger, that assessment might change.
Having gone through some refactorings before in this and other projects, 
I am confident that I will be able to manage that problem when it presents itself.
