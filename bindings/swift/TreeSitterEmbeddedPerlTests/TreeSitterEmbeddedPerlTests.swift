import XCTest
import SwiftTreeSitter
import TreeSitterEmbeddedPerl

final class TreeSitterEmbeddedPerlTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_embedded_perl())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Embedded Perl templates grammar")
    }
}
