import re

def process_file(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 查找markdown代码块
    pattern = r'```markdown\n(.*?)\n```'
    
    # 替换为MarkdownCard组件
    def replace_block(match):
        markdown_content = match.group(1).strip()
        # 处理内容中的换行，确保正确的缩进和格式
        lines = markdown_content.split('\n')
        processed_lines = []
        
        # 移除内容开头和结尾的空行
        while lines and not lines[0].strip():
            lines.pop(0)
        while lines and not lines[-1].strip():
            lines.pop()
            
        # 处理每一行，保持缩进
        for line in lines:
            if not line.strip():
                processed_lines.append('')
            else:
                # 计算原始缩进
                indent = len(line) - len(line.lstrip())
                indent_str = ' ' * indent
                processed_lines.append(f"{indent_str}{line.lstrip()}")
        
        # 组合处理后的内容，确保正确的缩进结构
        indented_content = '\n'.join(processed_lines)
        
        # 将内容包装在JSX表达式中
        return '{<MarkdownCard>' + indented_content + '</MarkdownCard>}'
    
    # 使用DOTALL标志来匹配跨行内容
    processed_content = re.sub(pattern, replace_block, content, flags=re.DOTALL)
    
    # 确保文件开头有必要的导入语句
    if 'import MarkdownCard' not in processed_content:
        processed_content = 'import MarkdownCard from \'../../components/MarkdownCard\';\n\n' + processed_content
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(processed_content)

if __name__ == '__main__':
    process_file('pages/economics/economics_2.mdx', 'pages/economics/economics_2.processed.mdx')