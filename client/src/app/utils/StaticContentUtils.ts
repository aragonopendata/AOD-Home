export default class StaticContentUtils {

    setAccessibility(contents, openedMenu){
		contents.forEach(content => {
			let htmlDocument = this.createHTMLDocumentFromString(content.contentText);
			let nodes = this.getNodesWithTabindex(htmlDocument, openedMenu);
			this.replaceNodes(nodes, openedMenu);
			content.contentText = htmlDocument.body.innerHTML;
		});
	}

	createHTMLDocumentFromString(content): Document{
		let parser = new DOMParser;
		return parser.parseFromString(content, 'text/html');
	}

	getNodesWithTabindex(htmlElement: Document, openedMenu: boolean){
		let nodes;
		if(openedMenu){
			nodes = this.getAccessiblitiyStatus(htmlElement, 'disabled');
		}else{
			nodes = this.getAccessiblitiyStatus(htmlElement, 'enabled');
		}
		return nodes;
	}

	getAccessiblitiyStatus(htmlElement: Document, status: string){
		if(status == 'disabled'){
			return htmlElement.querySelectorAll("[tabindex='-1']");
		}else{
			return htmlElement.querySelectorAll("[tabindex='0']");
		}
	}

	setAccessibilityStatus(node: Element, status: string): Element{
		if(status == 'enabled'){
			node.setAttribute('tabindex', '0');
		}else{
			node.setAttribute('tabindex', '-1');
		}
		return node;
	}

	replaceNodes(nodes: NodeListOf<Element>, openedMenu: boolean){
		for (let index = 0; index < nodes.length; index++) {
			let oldNode = nodes[index];
			let newNode;
			if(openedMenu){
				newNode = this.setAccessibilityStatus(nodes[index], 'enabled');
			}else{
				newNode = this.setAccessibilityStatus(nodes[index], 'disabled');
			}
			oldNode.parentNode.replaceChild(newNode, oldNode);
		}
	}
}