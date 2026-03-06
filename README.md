# tree-sitter-embedded-perl

[Tree-sitter][] grammar for [Mojolicious][]' Embedded Perl templates.

[tree-sitter]: https://github.com/tree-sitter/tree-sitter
[Mojolicious]: https://mojolicious.org

## Usage

### Neovim

```lua
-- Configure the parser to be installed by nvim-treesitter.
vim.api.nvim_create_autocmd('User', { pattern = 'TSUpdate',
    callback = function()
        require('nvim-treesitter.parsers').embedded_perl = {
            install_info = {
                url = 'https://github.com/jobindex-open/tree-sitter-embedded-perl',
                -- revision = <sha>, -- commit hash for revision to check out; HEAD if missing
                queries = 'queries-nvim',
            },
        }
    end
})

-- Register the parser for any custom filetypes you use for embedded Perl templates.
-- By default the parser is registered for the 'ep' filetype.
vim.treesitter.language.register('embedded_perl', { 'html.ep' })
```

## References

- [Mojolicious: Embedded Perl](https://docs.mojolicious.org/Mojolicious/Guides/Rendering#Embedded-Perl)
- [Mojolicious: Mojo::Template](https://docs.mojolicious.org/Mojo/Template)
