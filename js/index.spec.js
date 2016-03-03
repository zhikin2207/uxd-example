describe('CV Page', function() {
    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = '.';
        loadFixtures('index.html');
    });

    describe('Page structure', function() {
        it('Should contain header', function() {
            var header = $('header');

            expect(header).toExist();
        });

        it('Should contain "About me" block', function() {
            var blocks = $('article');

            expect(blocks.find('h2:contains("About Me")')).toExist();
        });

        it('Should contain "Education" block', function() {
            var blocks = $('article');

            expect(blocks.find('h2:contains("Education")')).toExist();
        });

        it('Should contain "Experiences" block', function() {
            var blocks = $('article');

            expect(blocks.find('h2:contains("Experiences")')).toExist();
        });

        it('Should contain "Contacts" block', function() {
            var blocks = $('article');

            expect(blocks.find('h2:contains("Contacts")')).toExist();
        });

        it('Should contain "Skills" block', function() {
            var blocks = $('article');

            expect(blocks.find('h2:contains("Skills")')).toExist();
        });

        it('Should contain "Languages" block', function() {
            var blocks = $('article');

            expect(blocks.find('h2:contains("Languages")')).toExist();
        });

        it('Should contain "Hobbies" block', function() {
            var blocks = $('article');

            expect(blocks.find('h2:contains("Hobbies")')).toExist();
        });

        it('Should noscript element', function() {
            var element = $('noscript');

            expect(element).toExist();
        });
    });

    describe('Page content', function() {
        it('Page header should contain name', function () {
            var header = $('header');

            expect(header).toContainText('Po');
        });

        it('Html elements does not contain style tag', function () {
            var elements = $('*[style]');

            expect(elements.length).toHaveLength(0);
        });
    });
});