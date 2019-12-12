class Button {
    constructor (name, x, y, width, height) {
        this.name = name;
        this.pos = createVector(x, y);
        if (height === undefined) height = width;
        this.dim = {width, height};
    }
    setOnClick (onClick) {
        this.onClick = onClick;
        return this;
    }
    setOnHover (onHover) {
        this.onHover = onHover;
        return this;
    }
    setImage (img) {
        this.img = img;
        return this;
    }
    listenClick() {
        if (this.isOnClick())
            this.onClick();
    }
    listenHover() {
        if (this.isOnHover())
            this.onHover();
    }
    isOnHover() {
        const mouse = createVector(mouseX, mouseY);
        const {pos, dim} = this;
        if (mouse.x >= pos.x && mouse.x <= pos.x+dim.width &&
            mouse.y >= pos.y && mouse.y <= pos.y+dim.height) return true;
        return false;
    }
    isOnClick() {
        return (this.isOnHover() && mouseButton == LEFT);
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