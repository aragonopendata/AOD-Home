import { AodWebPage } from './app.po';

describe('aod-web App', function () {
	let page: AodWebPage;

	beforeEach(() => {
		page = new AodWebPage();
	});

	it('should display message saying app works', () => {
		page.navigateTo();
		expect(page.getParagraphText()).toEqual('app works!');
	});
});
