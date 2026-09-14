import re

with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove Right Column (Description, CTA, Version Tag)
content = re.sub(r'\{/\* Right Column: Description & Refined CTA Button \*/\}.*?</div>\s*</div>', '</div>\n              </div>', content, flags=re.DOTALL)

# 2 & 4. Remove header and prompt bar (contains dreamframe on the left top and live prompt lab)
content = re.sub(r'<header className.*?</header>', '', content, flags=re.DOTALL)
content = re.sub(r'\{/\* Interactive Floating Prompt Bar \*/\}.*?\}\)}', '', content, flags=re.DOTALL)

# 3. Remove AI Image Generator badge
content = re.sub(r'\{/\* Availability / Engine Status Badge \*/\}.*?</div>', '', content, flags=re.DOTALL)

# 5. Change headline
content = re.sub(
    r'Create Studio-Quality.*?with Generative Precision',
    'Scroll animation created by Srikar',
    content,
    flags=re.DOTALL
)

# Also remove unused state to prevent lint errors
content = re.sub(r'const \[isMenuOpen, setIsMenuOpen\] = useState\(false\);\n', '', content)
content = re.sub(r'const \[showPromptBar, setShowPromptBar\] = useState\(false\);\n', '', content)
content = re.sub(r'const \[isGenerating, setIsGenerating\] = useState\(false\);\n', '', content)
content = re.sub(r'const \[activePrompt, setActivePrompt\] = useState\([^)]*\);\n', '', content, flags=re.DOTALL)
content = re.sub(r'const handleGenerate =.*?};\n', '', content, flags=re.DOTALL)
content = re.sub(r'const samplePrompts =.*?];\n', '', content, flags=re.DOTALL)

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated page.tsx successfully.")
