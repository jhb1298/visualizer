createItem = (type, dataType) => {
    let ID = this.state.id
    const func = this.state.functions.inside.find((f) => f.type === type)
    const assignment = (id) => { return { id: id, type: "assignment", sign: "=", inside: [{}, {}], indicator: false, elementType: "assignment" } }
    const conditional = (id) => { return { id: id, type: "conditional", sign: "==", inside: [{}, {}], indicator: false, elementType: "conditional" } }

    let data = {}
    switch (type) {
        case ("conditional"):
            data = { id: ID, type: type, sign: "=", inside: [{}, {}], indicator: false, elementType: "conditional" }
            ID += 1
            break;
        case ("assignment"):
            data = { id: ID, type: type, sign: "=", inside: [{}, {}], indicator: false, elementType: "assignment" }
            ID += 1
            break;
        case ("arithmatic"):
            data = { id: ID, type: type, sign: "+", inside: [{}, {}], indicator: false, elementType: "arithmatic" }
            ID += 1
            break;
        case ("cif"):
            data = { id: ID, type: type, showOptions: false, inside: [conditional(this.state.id + 1)], indicator: false, elementType: "cif" }
            ID += 2
            break;
        case ("celse"):
            data = { id: ID, inside: [], indicator: false, elementType: "celse" }
            ID += 1
            break;
        case ("cfor"):
            data = { id: ID, type: type, inside: [assignment(ID + 1), conditional(ID + 2), assignment(ID + 3)], indicator: false, elementType: "cfor" }
            ID += 4
            break;
        case ("cwhile"):
            data = { id: ID, type: type, condition: null, inside: [conditional(ID + 1)], indicator: false, elementType: "cwhile" }
            ID += 2
            break;
        case ("cdoWhile"):
            data = { id: ID, type: type, condition: null, inside: [conditional(ID + 1)], indicator: false, elementType: "cdoWhile" }
            ID += 2
            break;
        default:
            if (type[0] === '1') {
                data = { id: ID, type: type, params: func.params, inside: [], indicator: false, elementType: "function" }
            }
            else {
                data = { id: ID, dataType: type, type: 'var' + ID, value: null, inside: [], indicator: false, elementType: "variable" }
            }
            ID += 1
            break;
    }
    this.setState(() => ({
        id: ID
    }));

    return data
}