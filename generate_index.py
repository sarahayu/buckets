"""
Auto-generate index.jsx file because I am too lazy to update with new links manually

Usage: python3 generate_index.py
"""

import os
import re

SRC_DIR = 'src'

# collect all jsx files ending in 'App'
apps = [f.split('.')[0] for f in os.listdir(SRC_DIR) if re.match(r'\w*App\b.jsx', f)]

def lazyDefn(app_name):
    return f"const {app_name} = React.lazy(() => import(\"./{app_name}\"));"

def linkElem(app_name):
    return f"<Link to=\"{ app_name }\">{ app_name }</Link>"

def routeElem(app_name):
    return f"""<Route
        path="{ app_name }"
        element={{
          <React.Suspense fallback={{<>...</>}}>
            <{ app_name } />
          </React.Suspense>
        }}
      />"""

# generate index.html to link to Apps
with open(os.path.join(SRC_DIR, 'index.jsx'), 'w') as index_file:
    newline = '\n'
    index_file.write(f"""
import React from "react";
import ReactDOM from "react-dom/client";
import {{ HashRouter, Link, Route, Routes }} from "react-router-dom";
import "./index.css";

{ f'{newline}'.join(list(map(lazyDefn, apps))) }


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <Routes>
      <Route
        index
        element={{
          <main>
            { f'{newline}            '.join(list(map(linkElem, apps))) }
          </main>
        }}
      />
      { f'{newline}      '.join(list(map(routeElem, apps))) }
    </Routes>
  </HashRouter>
);

    """)