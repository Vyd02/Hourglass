# Builds husband.html (read-only view) from index.html. Run after every index.html change.
import pathlib
root=pathlib.Path(__file__).resolve().parent.parent
s=(root/'index.html').read_text()
s=s.replace('<link rel="manifest" href="manifest.webmanifest">\n','',1)
s=s.replace('<meta name="apple-mobile-web-app-title" content="Hourglass">','<meta name="apple-mobile-web-app-title" content="Katelyn">',1)
s=s.replace('<title>Hourglass Coach</title>',"<title>Katelyn's Hourglass</title>",1)
s=s.replace('</head><body>\n','</head><body>\n<script>window.HUSBAND_ONLY=1</script>\n',1)
assert 'window.HUSBAND_ONLY=1' in s
(root/'husband.html').write_text(s);print('husband.html built')
