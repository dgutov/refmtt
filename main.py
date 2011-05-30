# -*- coding: utf-8 -*-

import os
import cgi
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

class MainPage(webapp.RequestHandler):
    def get(self):
        values = {
          'breaks' : '.?!',
          'ignores' : cgi.escape("'\"») >}”", True),
          'preserve' : True,
          'min_chars' : 40,
          'remove_start_spaces' : True,
          'remove_symbols_spaces' : True,
          'no_space_symbols' : ',. ?!',
          'remove_empty_lines' : True,
          'max_empty_lines' : 2,
          'replace_symbols' : True,
          'symbols_to_replace' : cgi.escape('‘’`=>\', “”=>", –—=>--', True)
        }
        path = os.path.join(os.path.dirname(__file__), "index.html")
        self.response.headers['Content-Type'] = 'text/html'
        self.response.out.write(template.render(path, values))

application = webapp.WSGIApplication([('/', MainPage)], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
