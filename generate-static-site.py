import os
import re

SRC_DIR = 'src'
OUT_DIR = 'out'
APP_COMPONENT_PATTERN = 'APP_COMPONENT'

apps = [f.split('.')[0] for f in os.listdir(SRC_DIR) if re.match(r'\w*App\b.jsx', f)]

os.rename(os.path.join(SRC_DIR, 'index.jsx'), os.path.join(SRC_DIR, 'index.jsx.bk'))

os.system(f'rm -r { OUT_DIR }')
os.mkdir(OUT_DIR)

for app_name in apps:

    with open(os.path.join(SRC_DIR, 'index.jsx.template'), 'r') as template_file:
        template_contents = template_file.read()
        template_contents = template_contents.replace(APP_COMPONENT_PATTERN, app_name)

    with open(os.path.join(SRC_DIR, 'index.jsx'), 'w') as app_index_file:
        app_index_file.write(template_contents)
        
    os.system('npm run build')
    os.rename('build/', os.path.join(OUT_DIR, app_name))
            

os.rename(os.path.join(SRC_DIR, 'index.jsx.bk'), os.path.join(SRC_DIR, 'index.jsx'))

with open(os.path.join(OUT_DIR, 'index.html'), 'w') as index_file:
    newline = '\n'
    index_file.write(f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Start Page</title>
    <style>
        body {{
            display: grid;
            place-items: center;
            min-height: 100vh;
            font-size: 2rem;
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
            margin: 0;
            background-color: aliceblue;
        }}

        main {{
            display: flex;
            flex-direction: column;
            align-items: center;
        }}

        a {{
            padding: 1rem;
            text-decoration: none;
            color: darkslateblue;
        }}
    </style>
</head>
<body>
    <main>
    { newline.join([f'<a href="{app_name}/">{app_name}</a>' for app_name in apps]) }
    </main>
</body>
</html>
    """)