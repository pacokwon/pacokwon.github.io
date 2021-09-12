---
title: 'Spellchecking in Vim / Neovim'
tags:
  - vim
  - neovim
  - quicknote
  - en
---

Just until stumbling upon some random video on youtube about spellchecking in Vim, I didn't know such capability even existed in Vim. Turns out that you can, and it can be utilized in markdown files, commit messages and etc. This post is a demonstration of how you can enable and utilize spellchecking in Vim.

## Enabling Spellchecking in Vim

```vim
:set spell spellang=en_us " use english dictionary for spellchecking
```

To only set it for local buffers, use:

```vim
:setlocal spell spelllang=en_us
```

I utilize this primarily in autocmds, like this:

```vim
autocmd BufRead,BufNewFile *.md setlocal spell spelllang=en_us " enable spellchecking in markdown files
autocmd FileType gitcommit setlocal spell spelllang=en_us " enable spellchecking in git commit files
```

Once you have these set up, words that are recognized by the spellchecker will be highlighted according to the highlight groups `SpellBad`, `SpellCap`, `SpellRare`, `SpellLocal`. For further reference, consulting the `:help spell-quickstart` docs will come in handy. In my neovim setup, the words are shown underlined (Not exactly sure where it comes from).

## Utilizing it

One can get recommendations from the spellchecker from the completion engine. Run `set complete+=kspell`, as in:

```vim
autocmd FileType gitcommit setlocal spell spelllang=en_us | set complete+=kspell
```

One can navigate between recommendations in insert mode using `^N` and `^P`, and spellchecking recommendations will show up among the options.

Here are some commands I found useful:

- `]s` and `[s`: navigate between misspelled words. Former moves forward, the latter backwards.
- `z=`: see alternatives to the word under the cursor. For example, if I write `file` and run `z=` on it, it will recommend a list of words from the dictionary.
- `zg`: register a word as correct in the dictionary. The Vim dictionary does not know a lot of words, so it will mark a lot of words as incorrect. One way to solve that issue is to register a word to the dictionary. This command does that.
- `zw`: just like `zg`, but marks a word as incorrect.

For more, as always, consult the helpdocs. For spellchecking, `:help spell` is where you should go to.
