declare namespace cheerio {
	interface TextElement {
		attribs: Record<string, string>
	}

	interface TagElement {
		attribs: Record<string, string>
	}

	interface CommentElement {
		attribs: Record<string, string>
	}
}
