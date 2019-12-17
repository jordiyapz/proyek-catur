class Button {
    constructor (name, x, y, width, height) {
        this.name = name;
        this.pos = createVector(x, y);
        if (height === undefined) height = width;
        this.dim = {width, height};
        this.onClick = null;
        this.onMouseOver = null;
        this.onMouseOut = null;
    }
    setImage (img) {
        this.img = img;
        return this;
    }
    listenClick() {
        if (this.isClicked() && this.onClick)
            this.onClick();
    }
    listenHover() {
        if (this.isHovered() && this.onMouseOver)
            this.onMouseOver();
        else if (this.onMouseOut)
            this.onMouseOut();
    }
    isHovered() {
        const mouse = createVector(mouseX, mouseY);
        const {pos, dim} = this;
        if (mouse.x >= pos.x && mouse.x <= pos.x+dim.width &&
            mouse.y >= pos.y && mouse.y <= pos.y+dim.height) return true;
        return false;
    }
    isClicked() {
        return (this.isHovered() && mouseButton == LEFT);
    }
    render () {
        const {pos, dim} = this;
        const {x, y} = pos;
        const {width, height} = dim;
        if (this.img) {
            image(this.img, x, y, width, height);
        } else {
            text(name, x, y);
        }
    }
}