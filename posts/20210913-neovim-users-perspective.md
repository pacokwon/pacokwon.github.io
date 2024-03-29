---
title: "Neovim 0.5.0 - A User's Perspective"
tags:
  - neovim
  - en
---

It's been two years since I've first used Vim.

The reason I started to learn Vim was because I saw so many experience programmers using it. I thought that there must be something special to it, and I had to give it a try.

It wasn't easy at first. There certainly is a learning curve, and I often was tempted to go back to my old editor. But once I got used to it, it only got better from there. I loved the speed, the efficient keybindings, the ecosystem of plugins, and the fact that it's still a minimal editor that I configured for myself.

Then there was Neovim. The first time I've heard about it was from [coc.nvim](https://github.com/neoclide/coc.nvim), which was one of the few plugins that had great LSP support out of the box. It was from then I started using Neovim.

I suspect that Neovim was version `0.4.x` at the time. I couldn't feel _any_ differences from Vim whatsoever, but it turns out Neovim at that time was in the verge of a major breakthrough: `0.5.0`.

## Neovim `0.5.0`

Neovim `0.5.0` introduced a ton of new updates to the editor, as a user, there were 3 major featuresthat were added in this release.

### Built-in LSP client support

The Language Server Protocol is a spec that allows independent "language servers" to communicate with and provide useful functionalities such as `Hover Docs`, `Goto Definition`, `Format` to editors that implement a "language client". The separation of responsibilities allowed: language servers to do what they do best, and editors to offer rich features without implementing it themselves.

Previously, plugins were acting as LSP clients to communicate with the respective servers, and this is what coc.nvim was doing really well. But I felt guilty using it because one could easily see that it was a little bloated. It did too many things at once, not to mention that it spawned node processes in the background.

The built-in LSP support in the `0.5.0` release allowed users to configure lsp servers to their own preference by providing a generic configuration interface. It felt minimal, it was less laggy, I knew what it was doing, and I loved it. One downside might be that it requires a fair amount of code to configure.

### tree-sitter syntax highlighting support

The way Vim does highlighting is through regexes (AFAIK). It parses tokens through regexes and applies the corresponding highlight groups to them. tree-sitter is a replacement for this highlighting method.

tree-sitter is a dedicated parser generator, meaning that it outputs a parser given a certain language's grammar. I've heard good things about tree-sitter such as its performance and tolerance to syntax errors, but I won't go further because I don't have background knowledge to back it up - for all I know, it does its job really well, and it is capable of providing consistent syntax highlighting across a ton of languages.

So far, the syntax highlighting that tree-sitter provides has been really great, and it's making me happy.

### lua as a first class configuration language

Previously and still in Vim 8, vimscript remains the primary language for editor configuration. And vimscript is.. such an odd language. I tried learning it, but the experience was not so good. It was not like any other language that I've learned, and not in a good way either. IMO this would have certainly prevented some users from being able to comfortably write their `vimrc`s or plugins.

And then lua came in. It's a very small scripting language that got integrated into Neovim from `0.5.0`. Unlike vimscript it's a general purpose language, it makes more sense and knowledge can be transferred from and to other languages more easily. This allowed users to write their `vimrc`s and plugins in lua and only using lua. The pace at which new plugins came out after lua was first integrated into Neovim was astonishing. Although there now exists incompatibilities between Vim and Neovim with lua plugins, I'm still very happy that the ecosystem is thriving much faster now.

As someone who loves using and making tools for developers, Neovim stands as my favorite open source project. And because of that, one of my goals is to try to create plugins and/or contribute to the Neovim project. At least I hope to do so.
