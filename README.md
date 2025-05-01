********************************
Eendraadschema Community edition
********************************

## Purpose

Design and draw a one-wire diagram as enforced by the Belgian AREI legislation.
Source code written in Typescript, transpiled to Javascript and run in a browser.

## Build / Compile 

Below description is valid for a linux terminal with bash- or sh-shell.
With some extra tweaks, compilation on other systems should be possible as well.

- Extract all files and directories in a dedicated folder.
- Ensure you have a typescript compiler installed that can be called by the name "tsc"
- Run the ./compile -script from the dedicated folder.
- Open index.html with a modern browser

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

### Have you considered modern solutions to streamline the monolytic code, e.g. including modules and a module bundler

yes, but as the only developer on this still small code-base, I judge the benefit as being relatively limited.
Hence, while it is in my feature list, I do not expect it to get priority soon.
I'd rather spend that time on answering user queries and building features as per user suggestions.

In addition, having learned to program in an age where it was a popular challenge to build cool
graphical demos in a <= 4 kilobyte DOS-executable, I continue to be amazed at the megabytes of 
dependencies that modern programming environments apparently need to get "Hello world!" displayed on the console.

Call me old school, but I will only add dependencies to the project if I see a very clear benefit.

### Have you considered a framework like Angular, React, ...

Yes, and one day that might actually happen, but that day is not today.
Some earlier experiments were not entirely convincing as far as performance is concerned
and have reduced my appetite.

In addition, given the small size of the project, the old-school javascript-approach is at present
not holding me back in any way.  If the project grows significantly larger, that assessment might change.
Having gone through some refactorings before in this and other projects, 
I am confident that I will be able to manage that problem when it presents itself.
