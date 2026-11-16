PORT ?= 5173
ZIP  ?= dist/gns-site.zip
SRC  := index.html css js img

.PHONY: serve package clean

## serve: run a local static server (ES modules need http://, not file://)
serve:
	python3 -m http.server $(PORT)

## package: build a deployable zip for Cloudflare / Netlify drag-and-drop upload
package:
	@mkdir -p $(dir $(ZIP))
	@rm -f $(ZIP)
	@zip -rqX $(ZIP) $(SRC) -x '*.DS_Store'
	@echo "Created $(ZIP)"

clean:
	rm -rf dist
