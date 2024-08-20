package algorithms

type TrieNode struct {
	children       map[rune]*TrieNode
	isEndOfWord    bool
	patternIndices []int
	fail           *TrieNode
}

type AhoCorasick struct {
	root *TrieNode
}

func NewAhoCorasick() *AhoCorasick {
	return &AhoCorasick{
		root: &TrieNode{children: make(map[rune]*TrieNode)},
	}
}

func (ac *AhoCorasick) AddPattern(pattern string, index int) {
	node := ac.root
	for _, ch := range pattern {
		if _, exists := node.children[ch]; !exists {
			node.children[ch] = &TrieNode{children: make(map[rune]*TrieNode)}
		}
		node = node.children[ch]
	}
	node.isEndOfWord = true
	node.patternIndices = append(node.patternIndices, index)
}

func (ac *AhoCorasick) Build() {
	queue := []*TrieNode{ac.root}
	for len(queue) > 0 {
		node := queue[0]
		queue = queue[1:]

		for ch, child := range node.children {
			if node == ac.root {
				child.fail = ac.root
			} else {
				fail := node.fail
				for fail != nil {
					if _, exists := fail.children[ch]; exists {
						child.fail = fail.children[ch]
						break
					}
					fail = fail.fail
				}
				if fail == nil {
					child.fail = ac.root
				}
			}
			child.patternIndices = append(child.patternIndices, child.fail.patternIndices...)
			queue = append(queue, child)
		}
	}
}

func (ac *AhoCorasick) Search(text string) map[int][]int {
	node := ac.root
	results := make(map[int][]int)

	for i, ch := range text {
		for node != nil && node.children[ch] == nil {
			node = node.fail
		}
		if node == nil {
			node = ac.root
			continue
		}
		node = node.children[ch]
		for _, patternIndex := range node.patternIndices {
			results[patternIndex] = append(results[patternIndex], i)
		}
	}
	return results
}
