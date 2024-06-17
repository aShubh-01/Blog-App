export const htmlToString = (htmlData: string) => {
    console.log(typeof htmlData);
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlData, 'text/html');
    let text = doc.body.textContent || '';
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/ {2}/g, ' \u00A0');

    return text;
}