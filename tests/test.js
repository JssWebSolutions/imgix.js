'use strict';

describe('imgix-javascript unit tests', function() {

	beforeEach(function() {
		// nothing for now
	});

	it('parses url', function() {
		var i = new imgix.URL('http://static-a.imgix.net/macaw.png?w=500&sepia=33');
		expect(i.params, ["w", "sepia"]);

		expect(i.urlParts.paramValues["w"], 500);
		expect(i.urlParts.paramValues["sepia"], 33);
	});

	it('sets url params', function() {
		var i = new imgix.URL('http://static-a.imgix.net/macaw.png');
		i.setRotate(30);

		expect(i.urlParts.paramValues["rot"], 30);
		expect(i.getParam('rot'), 30);
		expect(i.getRotate(), 30);
		expect(i.getUrl()).toContain("rot=30");
	});


	var flag, objVal;
	it('test auto update...', function() {

		// create and inject and element to test with
		var img = document.createElement('img'),
			tmpId = 'test' + parseInt((Math.random() * 100000), 10);
		img.id = tmpId;
		img.src = 'http://static-a.imgix.net/macaw.png';
		document.body.appendChild(img);

		var flag = false;
		// ensure it exists
		expect(document.querySelector('#' + tmpId)).toBeDefined();

		// run our test
		runs(function() {

			var i = new imgix.URL('http://static-a.imgix.net/macaw.png?w=200');
			i.autoUpdateImg('#' + tmpId, function(obj) {
				objVal = obj;
				flag = true
			});

			i.setRotate(30);
		});

		waitsFor(function() {
			return flag;
		}, "Waiting for autoUpdateImg...", 5000);

		runs(function() {
			expect(objVal.className, '.imgix-el-02345d7e9857180083e75a8bd32f125b');
			expect(objVal.percentComplete).toEqual(100);
			expect(objVal.totalComplete).toEqual(1);
			expect(objVal.isComplete).toEqual(true);
			expect(!!objVal.element).toEqual(true);
			expect(objVal.loadTime).toBeGreaterThan(-1);

			expect(img.src).toContain('rot=30');

			document.body.removeChild(img);
		});
	});

	it('sets url params', function() {
		var i = new imgix.URL('http://static-a.imgix.net/macaw.png');
		i.setRotate(30);

		expect(i.urlParts.paramValues["rot"], 30);
		expect(i.getParam('rot'), 30);
		expect(i.getRotate(), 30);
		expect(i.getUrl()).toContain("rot=30");
	});

	it('sets params in constructor', function() {
		var i = new imgix.URL('http://static-a.imgix.net/macaw.png', {w: 200, sepia: 50});

		expect(i.urlParts.paramValues["w"], 200);
		expect(i.getParam('w'), 200);
		expect(i.getWidth(), 200);
		expect(i.getUrl()).toContain("w=200");

		expect(i.urlParts.paramValues["sepia"], 50);
		expect(i.getParam('sepia'), 50);
		expect(i.getSepia(), 50);
		expect(i.getUrl()).toContain("sepia=50");
	});

	it('sets multiple url params', function() {
		var i = new imgix.URL('http://static-a.imgix.net/macaw.png');

		i.setParams({rot: 30, w: 100});

		expect(i.urlParts.paramValues["rot"], 30);
		expect(i.getParam('rot'), 30);
		expect(i.getRotate(), 30);
		expect(i.getUrl()).toContain("rot=30");

		expect(i.urlParts.paramValues["w"], 100);
		expect(i.getParam('w'), 100);
		expect(i.getWidth(), 100);
		expect(i.getUrl()).toContain("w=100");
	});

	it('clear params', function() {
		var i = new imgix.URL('http://static-a.imgix.net/macaw.png?w=500&sepia=50');

		i.clearParams();
		expect(i.params, []);
	});

	it('clearThenSetParams', function() {
		var i = new imgix.URL('http://static-a.imgix.net/macaw.png?w=500&sepia=50');

		i.clearThenSetParams({h: 100, blur: 50});
		expect(i.params, ["h", "blur"]);
	});

	it('overrides url params', function() {
		var i = new imgix.URL('http://static-a.imgix.net/macaw.png?blur=40');

		expect(i.urlParts.paramValues["blur"], 40);
		expect(i.getBlur(), 40);

		i.setBlur(50); // now override

		expect(i.urlParts.paramValues["blur"], 50);
		expect(i.getBlur(), 50);
	});

	it('has fonts', function() {
		expect(imgix.isFontAvailable("Verdana"), true);
		expect(imgix.isFontAvailable("Blarg"), false);

		var i = new imgix.URL('http://static-a.imgix.net/macaw.png?blur=40');
		i.setTextFont("American Typewriter Condensed Bold");
		expect(i.getTextFont(), "American Typewriter Condensed,bold");

		// search fonts
		expect(imgix.searchFonts('arial'), ["Arial", "Arial Black", "Arial Bold", "Arial Bold Italic", "Arial Italic"]);

		expect(imgix.searchFonts('blah'), []);
	});

	it('overrides url params', function() {
		var i2 = new imgix.URL('http://static-a.imgix.net/macaw.png');
		i2.setRotate(33, false); // should override since does not exist
		expect(i2.urlParts.paramValues["rot"], 33);
		expect(i2.getRotate(), 33);

		var i = new imgix.URL('http://static-a.imgix.net/macaw.png?blur=40');
		expect(i.urlParts.paramValues["blur"], 40);
		expect(i.getBlur(), 40);

		i.setBlur(50, false); // should NOT override since does exist

		expect(i.urlParts.paramValues["blur"], 40);
	});

	it('returns the proper palette colors for no param', function() {
		var returnColors;

		runs(function() {
			var i = new imgix.URL('http://static-a.imgix.net/macaw.png');

			i.getColors(function(colors) {
				returnColors = colors;
			});
		});

		waitsFor(function() {
			return returnColors;
		}, "Waiting for autoUpdateImg...", 5000);

		runs(function() {
			expect(returnColors).toEqual(["rgb(251, 150, 23)", "rgb(240, 136, 18)", "rgb(224, 62, 5)", "rgb(216, 115, 39)", "rgb(119, 145, 198)", "rgb(149, 150, 166)", "rgb(72, 91, 134)", "rgb(57, 72, 103)", "rgb(47, 56, 78)", "rgb(50, 52, 50)"]);
		});
	});

	it('returns the proper palette colors for 3', function() {
		var returnColors;

		runs(function() {
			var i = new imgix.URL('http://static-a.imgix.net/macaw.png');

			i.getColors(3, function(colors) {
				returnColors = colors;
			});
		});

		waitsFor(function() {
			return returnColors;
		}, "Waiting for autoUpdateImg...", 2000);

		runs(function() {
			expect(returnColors).toEqual( [ 'rgb(251, 150, 23)', 'rgb(212, 58, 6)', 'rgb(57, 72, 103)' ]);
		});
		
	});

	it('md5s strings correctly', function() {
		expect(imgix.md5("imgix")).toEqual("f12c7c39333410c10c2930b57116a943");
	});

	it('re-signs correctly', function() {


		var su = "http://visor.imgix.net/http://a.abcnews.com/assets/images/navigation/abc-logo.png?rot=10&s=blah";

		var i = new imgix.URL(su, {}, config.visorToken)
		i.setRotate(15);

		expect(i.getUrl()).toEqual("http://visor.imgix.net/http://a.abcnews.com/assets/images/navigation/abc-logo.png?rot=15&s=623966184d550b3bcb6a973040f8aa5d");
	});

	it('converts rgb to hex colors correctly', function() {
		expect(imgix._rgbToHex('rgb(251, 150, 23)').toLowerCase()).toEqual('fb9617');
	});

	it('converts rgb to hex colors correctly on setBlend', function() {

		var i = new imgix.URL('http://static-a.imgix.net/');
		i.setBlend('rgb(255, 0, 0)');
		expect(i.getBlend()).toEqual('ff0000');
	});


	it('extracts xpath correctly', function() {
		var img = document.createElement('img'),
			tmpId = 'test' + parseInt((Math.random() * 100000), 10);
		img.id = tmpId;
		img.src = 'http://static-a.imgix.net/macaw.png';
		document.body.appendChild(img);

		var flag = false;
		var el = document.querySelector('#' + tmpId);


		expect(el).toBeDefined();
		expect(imgix._getElementTreeXPath(el)).toEqual('/html/body/img');

		document.body.removeChild(img);
	});

});
