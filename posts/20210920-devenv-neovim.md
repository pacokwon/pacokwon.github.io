---
title: 'Development Environment - Neovim'
tags:
  - neovim
  - ko
---

이 글에는 내가 주로 사용하는 neovim 에디터 환경설정, 그 중 플러그인에 대해 적어보려 한다 (한마디로 별 쓸데없음).

neovim이 `0.5.0` 업데이트 이후로 lua의 first class support를 추가하였고, 점점 쓰기 편하게 개발이 진행되고 있는 상태이다. 나는 vimscript와 lua 모두 아주 잘 알지는 않지만 그냥 궁금해서 환경설정 일부는 lua로 바꿔둔 상태이다. 물론 이렇게 하고 나니 그냥 vim 쓸 때는 호환이 안되는게 좀 불편해서 vim 용 설정은 따로 유지를 해야 하나 싶다...암튼 그래서 내 현재 neovim 설정은 일부가 lua로 적혀있을 뿐만 아니라 아주 많은 lua plugin을 사용하고 있다.

내 환경설정은 [여기](https://github.com/pacokwon/nvim-config)에서 관리하고 있다. 현재 설정 모습은 이렇다.

```plaintext
.
├── init.vim            # config root file
└── lua                 # configs written in lua
   ├── colors.lua       # theme
   ├── init.lua         # root file written in lua
   ├── mappings.lua     # keymappings
   ├── opts.lua         # editor options
   └── plugins          # plugin configuration
```

## Plugin Manager

나는 한동안 `vim-plug` 를 사용하다가 `packer.nvim` 으로 플러그인 매니저를 갈아탄 상태다. lua로 작성돼있다. 유저도 많고 굉장히 빠르다고 되어있길래 한 번 갈아타봤는데 실제로 빠른 것 같기도 하고 별 문제없이 작동하는 것 같아서 그냥 계속 사용하고 있는 중이다.

## Plugins

내가 주로 사용하는 플러그인 목록이다. 실제 사용하는건 나열한 것의 1.5 ~ 2배 정도 되지 않을까 싶다.

### [nvim-miniyank](https://github.com/bfredl/nvim-miniyank)

clipboard를 system clipboard로 연결해둔 상태일 때 neovim에서 Visual Block 붙여넣기가 잘 작동하지 않는 버그가 있다. 이유가 뭔지는 까먹었었는데 플러그인의 형태로 솔루션이 존재해서 사용하고 있다.

### [galaxyline.nvim](https://github.com/glepnir/galaxyline.nvim)

아주 미니멀하고 커스터마이징이 쉬운 statusline이다. 모든 걸 직접 설정해줘야 한다는 장벽이 있지만 한번 설정해놓으면 문제없다. 그래서 아주 심플한 statusline을 쓰고 있다. lua로 되어있다.

### [lspsaga.nvim](https://github.com/glepnir/lspsaga.nvim)

아주 필수적인 플러그인은 아니다. 나는 LSP diagnostics를 조금 더 꾸며진 floating window에서 보고 싶어서 설치해 두었다. LSP hover docs의 경우 요 플러그인에서 제공하는 함수를 사용하고 있었는데 lspconfig 플러그인에서 거의 같은 기능을 제공하고 있어서 갈아탔었다. diagnostic 쪽도 같은 기능을 lspconfig에서 제공하고 있으면 그냥 안 써도 무방할 것 같다.

### [nvim-compe](https://github.com/hrsh7th/nvim-compe)

LSP autocompletion을 completion list로 보여주는 플러그인이다. 이미 LSP가 있어도 이러한 플러그인이 있어야 LSP 자동완성을 편하게 사용할 수 있다.

아마 지금 글 쓰는 시점에서는 deprecated된 것으로 아는데 아무 문제 없어서 그냥 쓰고 있다ㅋㅋ듣기로는 같은 개발자의 `nvim-cmp` 라는 플러그인이 거의 같은 역할을 하는데 scalability를 염두에 두고 다시 작성한 것으로 알고 있다.

처음에 LSP 지원이 나왔을 때는 `nvim-completion` 인가? 라는 플러그인이 거의 유일했는데 이게 훨씬 나아서 나 포함해서 사람들이 요걸로 갈아탔었다.

### [fzf.vim](https://github.com/junegunn/fzf.vim)

`fzf` 라는 fuzzy finder를 vim에서 쉽게 사용할 수 있도록 한 wrapper이다. 놓칠 수 없는 플러그인들 중 하나다. 매우 빠르다는 것이 장점이고 Silver Searcher, ripgrep, fd 등 내부에서 사용하는 커맨드 또한 변경 가능해서 gitignore를 respect하게 하는 등의 기능 또한 가능하다.

### [gitsigns.nvim](https://github.com/lewis6991/gitsigns.nvim)

라인마다 깃 상태를 보여주는 플러그인이다. 특정 줄들이나 블록을 stage, unstage, reset하는 함수들을 제공한다. vscode의 gitlens에서 제공하는 라인별 blame 정보 보여주기나, 깃 상태가 바뀐 줄에 대하여 floating window에서 diff를 보여주는 기능 또한 매우 유용하다. lua로 작성되어 있으며 이전에는 gitgutter라는 vim 플러그인을 썼었다.

### [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig)

LSP 설정을 위한 플러그인이다. LSP Client 기능 자체는 neovim에 내장되어 있지만, 설정을 간편하게 해주는 용도로 존재하는 플러그인이다. LSP가 없으면 안되는 것은 아니지만 사용하게 되면 삶의 질이 많이 올라가기 때문에 나는 되도록이면 쓰려고 한다. 근데 설정이 좀 어려운 경우도 있기는 하다.

### [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter)

Treesitter 설정을 위한 플러그인이다. 설정에서 어떤 언어들에 대하여 treesitter를 사용할지 선택할 수 있고, 그에 따른 treesitter syntax highlighting을 제공한다. 훨씬 일관적인 highlighting을 사용할 수 있다. 이 플러그인이 있으면 언어별로 추가적인 highlight group을 담고 있는 플러그인을 설치해서 사용할 필요가 없어진다.

### [pears.nvim](https://github.com/steelsojka/pears.nvim)

autopairs 플러그인이다. lua로 작성되어 있으며 내가 한창 lua로 작성된 플러그인들을 시도하던 와중 갈아탔었다. autopairs라는 것은 예를 들어 `(` 를 입력하면 그 옆에 `)` 가 자동으로 입력된다거나, `)` 바로 왼쪽에서 `)` 를 누르면 해당 문자를 한 번 더 적는 게 아니라 알아서 건너뛰는 기능을 이야기한다. 근데 이 플러그인의 경우 개발이 활발하지는 않아서 엄청 추천하지는 않는다. 오히려 기존에 사용하던 jiangmiao의 auto-pairs가 기능도 조금 더 많고 안정적인 것 같다. lua로 작성된 다른 autopairs 플러그인도 많다.

### [vim-commentary](https://github.com/tpope/vim-commentary)

주석 처리용 플러그인이다. 놓칠 수 없는 플러그인들 중 하나다. 설치를 하면 `gc` 라는 verb가 생긴다. verb라는 것은 `d`, `c`, `v` 같은 동작을 하는 키바인딩을 이야기한다. 예를 들어 `gcj` 를 입력하면 현재 줄과 아래 줄이 주석 처리된다. 매우 편리하고 사용하기도 자연스러워서 그냥 vim 코어에 통합돼도 아무 문제가 없을 것 같다.

### [vim-surround](https://github.com/tpope/vim-surround)

`(`, `{`, `[`, `'`, `"` 처럼 짝꿍이 있는 문자들을 위한 플러그인이다. 놓칠 수 없는 플러그인들 중 하나다. 설치하면 `ys`, `ds`, `cs` 등의 verb가 생긴다. 예를 들어 `ysiw(` 를 하면 현재 커서가 있는 단어를 `()` 로 감싼다. `ds(` 를 하면 괄호를 삭제하고, `cs({` 를 하면 소괄호를 중괄호로 바꿔준다. 용법이 매우 자연스럽고 이것도 그냥 코어에 통합돼도 문제 없을 것 같은데...

### [vim-fugitive](https://github.com/tpope/vim-fugitive)

Git wrapper 플러그인이다. 플러그인 중 거의 1순위다. 있으면 git 관리가 정말 편해진다.

## Colorschemes

테마도 신경쓰는 편이다. 나는 대체로 high contrast 테마를 좋아한다.

- [tokyonight.nvim](https://github.com/folke/tokyonight.nvim) - 차가운 계열의 테마다
- [srcery-vim](https://github.com/srcery-colors/srcery-vim) - 따뜻한 계열의 테마다
- [modus-theme-vim](https://github.com/ishan9299/modus-theme-vim) - high contrast 만땅이면서 색깔이 마음에 든다
- [panic.vim](https://github.com/pacokwon/panic.vim) - 역시 high contrast 만땅이다. 다만 유지보수가 되고 있지는 않아서 fork해서 내가 사용하는 플러그인들에서 요하는 highlight group들을 추가해 쓰는 중이다.
- [onedarkhc.vim](https://github.com/pacokwon/onedarkhc.vim) - 기존에 있던 onedark의 색깔들을 수정해서 조금 더 high contrast로 만들어 두었다. 사실 색깔만 바꾼거라 fork하는게 맞는데 1학년 때 암 생각없이 만들었어서 README에 credit만 해놓은 상태다.
