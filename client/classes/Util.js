class Util {
    static objCloner(obj) {
        if (typeof(obj) == 'object') {
            const newObj = {};
            for (const key in obj) {
                newObj[key] = Util.objCloner(obj[key]);
            }
            return newObj;
        } else return obj;
    }
}
