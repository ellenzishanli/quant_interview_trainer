import os, functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
Handler = functools.partial(SimpleHTTPRequestHandler, directory=ROOT)
print("Serving %s at http://127.0.0.1:4173" % ROOT)
ThreadingHTTPServer(("127.0.0.1", 4173), Handler).serve_forever()
