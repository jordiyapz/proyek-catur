class Button {
    constructor (name, x, y, width, height) {
        this.name = name;
        this.pos = createVector(x, y);
        if (height === undefined) height = width;
        this.dim = {width, height};
    }
    set setOnClick (onClick) {
        this.onClick = onClick;
    }
    set setOnHover (onHover) {
        this.onHover = onHover;
    }
    set setImage (img) {
        this.img = img;
    }
    listenClick() {
        if (this.isOnHover())
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