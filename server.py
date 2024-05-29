import http.server
import socketserver
import os

class MyRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path != '/' and not os.path.exists(self.path[1:]):
            self.path = '/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

PORT = 8000

with socketserver.TCPServer(("", PORT), MyRequestHandler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()
