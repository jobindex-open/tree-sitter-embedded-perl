package tree_sitter_embedded_perl_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_embedded_perl "github.com/jobindex-open/tree-sitter-embedded-perl/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_embedded_perl.Language())
	if language == nil {
		t.Errorf("Error loading Embedded Perl templates grammar")
	}
}
