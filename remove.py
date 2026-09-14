with open('app/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Remove chunks (in reverse order so indices don't shift)
del lines[1381:1384]
del lines[899:1358]

start_header = -1
for i, line in enumerate(lines):
    if 'href="#3d-creator"' in line and 'setIsMenuOpen(false)' in line:
        start_header = i
if start_header != -1:
    del lines[start_header:start_header+7]

start_effect = -1
for i, line in enumerate(lines):
    if '// 3D Viewport auto-rotate effect' in line:
        start_effect = i
if start_effect != -1:
    del lines[start_effect:start_effect+10]

start_handler = -1
for i, line in enumerate(lines):
    if 'const handle3DGenerate = ' in line:
        start_handler = i
if start_handler != -1:
    del lines[start_handler:start_handler+7]

start_state = -1
for i, line in enumerate(lines):
    if '// 3D Model Creator Section Interactive State' in line:
        start_state = i
if start_state != -1:
    del lines[start_state:start_state+12]

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('Done!')
