" ======================
" 基本设置
" ======================

" 禁用兼容模式（确保 Vim 行为一致）
set nocompatible

" 关闭文件类型检测（Vundle 需要）
filetype off

" 显示行号
set number

" 显示相对行号
set relativenumber

" 设置 Tab 宽度为 4
set tabstop=4

" 设置自动缩进宽度为 4
set shiftwidth=4

" 将 Tab 转换为空格
set expandtab

" 自动缩进
set autoindent

" 智能缩进
set smartindent

" 高亮当前行
set cursorline

" 启用鼠标支持
set mouse=a

" 设置编码为 UTF-8
set encoding=utf-8

" 共享系统剪贴板
set clipboard=unnamedplus

" 修改 Leader 键的映射
let mapleader = ","

" 设置 Coc.nvim 的 Node.js 路径
let g:coc_node_path = trim(system('which node'))

" 设置 Coc.nvim 的 npm 镜像源
let g:coc_config = {
  \ 'npm.registry': 'https://registry.npmmirror.com'
\ }

" 复制到系统剪贴板
vnoremap <C-c> :w !xclip -selection clipboard<CR><CR>

" 从系统剪贴板粘贴
nnoremap <C-v> :r !xclip -selection clipboard -o<CR>

" 设置 Vundle 插件管理器的运行时路径
set rtp+=~/.vim/bundle/Vundle.vim

" ======================
" 插件管理（Vundle）
" ======================

call vundle#begin()

" 通用插件
Plugin 'preservim/nerdtree'                          " 文件树插件
Plugin 'tiagofumo/vim-nerdtree-syntax-highlight'     " NERDTree 语法高亮
Plugin 'ryanoasis/vim-devicons'                      " 文件图标
Plugin 'vim-airline/vim-airline'                     " 状态栏插件
Plugin 'vim-airline/vim-airline-themes'              " 状态栏主题
Plugin 'tpope/vim-fugitive'                          " Git 集成
Plugin 'airblade/vim-gitgutter'                      " Git 差异提示
Plugin 'preservim/nerdcommenter'                     " 快速注释
Plugin 'junegunn/fzf', { 'do': { -> fzf#install() } }" 模糊搜索
Plugin 'junegunn/fzf.vim'                            " FZF 集成
Plugin 'yggdroot/indentline'                         " 缩进线
Plugin 'sheerun/vim-polyglot'                        " 多语言支持
Plugin 'majutsushi/tagbar'                           " 代码结构导航
Plugin 'tpope/vim-surround'                          " 快速操作括号、引号
Plugin 'jiangmiao/auto-pairs'                        " 自动补全括号
Plugin 'wfxr/code-minimap.vim'                       " 一个基于外部工具的高性能 MiniMap 插件，支持更好的宽字符显示

" Rust 插件
Plugin 'rust-lang/rust.vim'                          " Rust 支持
Plugin 'rust-analyzer/rust-analyzer'                 " Rust 分析器

" Go 插件
Plugin 'fatih/vim-go'                                " Go 支持

" Markdown 插件
Plugin 'iamcco/markdown-preview.nvim'                " Markdown 预览

" LeetCode 插件
Plugin 'ianding1/leetcode.vim'                       " LeetCode 支持

" 主题插件
Plugin 'NLKNguyen/papercolor-theme'                  " PaperColor 主题

call vundle#end()

" ======================
" 插件配置
" ======================

" NERDTree 配置
let NERDTreeShowHidden=1                             " 显示隐藏文件
autocmd VimEnter * NERDTree                          " 启动时打开 NERDTree
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * NERDTree | if argc() > 0 || exists("s:std_in") | wincmd p | endif
autocmd BufEnter * if tabpagenr('$') == 1 && winnr('$') == 1 && exists('b:NERDTree') && b:NERDTree.isTabTree() | quit | endif

" 文件图标配置
set encoding=UTF-8
set guifont=DejaVu\ Sans\ Mono

" Rust 配置
let g:rustfmt_autosave = 1                           " 保存时自动格式化 Rust 代码

" Coc.nvim 配置
let g:coc_global_extensions = [
  \ 'coc-json',
  \ 'coc-tsserver',
  \ 'coc-python',
  \ 'coc-rust-analyzer',
  \ 'coc-go',
  \ 'coc-clangd',
  \ 'coc-java',
  \ 'coc-html',
  \ 'coc-css',
  \ 'coc-eslint',
  \ 'coc-prettier'
  \ ]

" Airline 配置
let g:airline_theme='gruvbox'                        " 状态栏主题

" IndentLine 配置
let g:indentLine_char = '│'                          " 缩进线字符

" Markdown 预览配置
let g:mkdp_browser = "chrome"                        " 设置 Markdown 预览浏览器

" LeetCode 配置
let g:leetcode_browser = "chrome"                    " 设置 LeetCode 浏览器

" MiniMap  配置
let g:minimap_auto_start = 1  " 自动启动 MiniMap
let g:minimap_auto_start_win_enter = 1  " 进入窗口时自动启动
let g:minimap_highlight_range = 1  " 高亮显示当前可见范围
let g:minimap_highlight_search = 1  " 高亮显示搜索结果
let g:minimap_git_colors = 1  " 显示 Git 差异颜色

" ======================
" 快捷键映射
" ======================

" 打开/关闭文件树
nnoremap <C-n> :NERDTreeToggle<CR>

" 模糊搜索文件
nnoremap <C-p> :Files<CR>

" 模糊搜索内容
nnoremap <C-f> :Rg<CR>

" 打开/关闭代码结构导航
nnoremap <C-b> :TagbarToggle<CR>

" 跳转到定义
nnoremap <leader>gd :ALEGoToDefinition<CR>

" 查找引用
nnoremap <leader>gr :ALEFindReferences<CR>

" 自动修复代码
nnoremap <leader>qf :ALEFix<CR>

" 保存文件
nnoremap <C-s>w :w<CR>
inoremap <C-s> <Esc>:w<CR>a

" 退出文件 - 保存并退出所有文件
nnoremap <Leader>q :wq<CR>
" 退出文件 - 强制退出所有文件
nnoremap <Leader>qa! :qa!<CR> 
" ======================
" 主题与界面美化
" ======================

" 设置终端颜色支持
set t_Co=256

" 设置背景为暗色
set background=dark

" 设置主题为 PaperColor
colorscheme PaperColor

" 启用语法高亮
syntax enable

" 启用文件类型检测和插件支持
filetype plugin indent on

" ======================
" 其他优化
" ======================

" 自动补全括号和引号
inoremap " ""<left>
inoremap ' ''<left>
inoremap ( ()<left>
inoremap [ []<left>
inoremap { {}<left>

" 自动保存
autocmd TextChanged,TextChangedI * silent write

" 自动切换工作目录
autocmd BufEnter * silent! lcd %:p:h
