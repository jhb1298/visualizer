import React from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { debounce } from 'lodash';

const cloneDeep = require('lodash/cloneDeep')

class Code extends React.Component {


    constructor(props) {

        super(props);
        this.state = {
            id: 10,

            tmp: [],

            code: "",
            responseData: "",

            showOutput: false,
            //for sidebar
            showHeaderlist: true,
            showDefineSection: true,
            showDeclareVariable: true,
            showInputFields: true,
            showConditionals: true,
            showLoops: true,
            showFunctions: true,
            showOthers: true,

            value: null,
            inc: 0,

            showDataTypes: false,
            showParamTypes: false,
            headers: ["stdio.h", "math.h", "string.h"],
            cheaders: [],
            defines: {
                inside: []
            },
            gVariables: {
                inside: []
            },

            functions: {
                inside: [
                    {
                        showParamTypes: false,
                        showOptions: false,
                        id: 0,
                        type: "1main",
                        returnType: "int",
                        defination: true,
                        NumberOfParams: 0,
                        inside: [


                        ]
                    },

                    {
                        showParamTypes: false,
                        showOptions: false,
                        id: 1,
                        type: "1printf",
                        returnType: "void",
                        defination: false,
                        NumberOfParams: 2,
                        inside: [
                            { id: 3, dataType: "char[]", type: 'var' + 3, value: null, inside: [{}], indicator: false, elementType: "param" },
                            { id: 4, dataType: "any", type: 'var' + 4, value: null, inside: [{}], indicator: false, elementType: "param" }
                        ]
                    },
                    {
                        showParamTypes: false,
                        showOptions: false,
                        id: 2,
                        type: "1scanf",
                        returnType: "void",
                        defination: false,
                        NumberOfParams: 2,
                        inside: [
                            { id: 5, dataType: "char[]", type: 'var' + 5, value: null, inside: [{}], indicator: false, elementType: "param" },
                            { id: 6, dataType: "any", type: 'var' + 6, value: null, inside: [{}], indicator: false, elementType: "param" }
                        ]
                    }
                ]
            }

        };
    }








    adjustInputWidth = () => {
        const inputs = document.getElementsByClassName('autoAdjust'); // Replace 'myInput' with the actual class of your input fields

        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            input.style.width = '20px'; // Reset width to 'auto' to get the natural width
            input.style.width = input.scrollWidth + 5 + 'px';
        }
    }

    variableName = (event) => {
        const input = event.target;
        const inputValue = input.value;

        // Check if the input matches a valid C variable name
        const isValidCVariableName = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(inputValue);

        if (!isValidCVariableName) {
            if (/^[0-9]/.test(inputValue)) {
                alert("Number cannot be in the first place");
            } else {
                alert("Invalid character");
            }

            // Remove the last character from the input value
            input.value = inputValue.slice(0, -1);

            // Highlight the input as invalid
            input.classList.add('invalid-input');
        } else {
            // If the input is valid, remove any previous invalid styling
            input.classList.remove('invalid-input');
        }
    }

    floatValue = (event) => {
        const input = event.target;
        const inputValue = input.value;

        // Check if the input matches a numeric value
        const isNumericValue = /^[-+]?\d*\.?\d*$/.test(inputValue);

        if (!isNumericValue) {
            alert("Invalid value");

            // Remove the last character from the input value
            input.value = inputValue.slice(0, -1);

            // Highlight the input as invalid
            input.classList.add('invalid-input');
        } else {
            // If the input is valid, remove any previous invalid styling
            input.classList.remove('invalid-input');
        }
    }

    intValue = (event) => {
        const input = event.target;
        const inputValue = input.value;

        // Check if the input matches an integer value
        const isIntegerValue = /^[-+]?\d+$/.test(inputValue);

        if (!isIntegerValue) {
            alert("Invalid integer value");

            // Remove the last character from the input value
            input.value = inputValue.slice(0, -1);

            // Highlight the input as invalid
            input.classList.add('invalid-input');
        } else {
            // If the input is valid, remove any previous invalid styling
            input.classList.remove('invalid-input');
        }
    }

    charValue = (event) => {
        const input = event.target;
        const inputValue = input.value;

        // Check if the input matches a single character surrounded by single quotes
        const isCharacterValue = /^.$/.test(inputValue);

        if (!isCharacterValue) {
            alert("Input must be a single character surrounded by single quotes (e.g., 'a')");

            // Remove the last character from the input value
            input.value = inputValue.slice(0, -1);

            // Highlight the input as invalid
            input.classList.add('invalid-input');
        } else {
            // If the input is valid, remove any previous invalid styling
            input.classList.remove('invalid-input');
        }
    }



    findIndices = (obj) => {
        let indices = [];
        let func = this.state.functions
        let flag = false
        console.log("Object to find indicess:", obj)
        const searchInside = (s) => {
            if (s.hasOwnProperty("inside")) {
                for (let i = 0; i < s.inside.length; i++) {
                    if (s.inside[i].id === obj.id) {
                        indices.push(i);
                        flag = true
                        return;
                    } else {
                        indices.push(i);
                        searchInside(s.inside[i]);
                        if (flag === false) {
                            indices.pop();
                        }
                        else {
                            return
                        }
                    }
                }
            }
        };

        searchInside(func);
        return indices;
    };

    findObjectWithID = (id, indexF, prevStateV) => {
        let object = null
        let stateV = null

        if (prevStateV) {
            stateV = prevStateV
        }
        else {
            stateV = this.state
        }

        const findObj = (obj) => {
            if (obj && obj.hasOwnProperty("inside")) {
                for (let i = 0; i < obj.inside.length; i++) {
                    if (obj.inside[i].id === id) {
                        object = obj.inside[i]
                        break
                    } else if (obj.inside[i]) {
                        findObj(obj.inside[i]);
                    }
                }
            }
        };

        findObj(stateV.defines)

        findObj(stateV.gVariables)

        if (indexF) {
            findObj(stateV.functions.inside[indexF])
        }
        else {
            findObj(stateV.functions)
        }

        return object

    }


    insertItem = (obj, indexF, data, position, empty) => {
        if (data != null) {
            let indices = this.findIndices(obj, indexF);
            let parent = null
            this.setState(prevState => {
                const updatedFunc = cloneDeep(prevState.functions);
                let x = 0;
                let addPos = 0

                const update = (updated) => {
                    if (x < indices.length) {
                        x++;
                        parent = updated.inside
                        update(updated.inside[indices[x - 1]]);
                    } else {

                        if (empty) {
                            if (data.type !== "celse") {
                                updated.inside.splice(updated.inside.length, 0, data)
                            }
                            return
                        }
                        if (position === "top") {
                            addPos = 0
                        } else {
                            addPos = 1

                        }

                        if (data.type === "celse") {
                            if (parent[indices[x - 1]].type === "cif") {
                                if (parent.length > indices[x - 1] + 1) {
                                    if (parent[indices[x - 1] + 1].type !== "celse") {
                                        parent.splice(indices[x - 1] + addPos, 0, data);
                                    }
                                }
                                else {
                                    parent.splice(indices[x - 1] + addPos, 0, data);
                                }
                            }
                        }
                        else {
                            parent.splice(indices[x - 1] + addPos, 0, data);
                        }

                        /* parent.splice(indices[x - 1] + 1, 0, data);*/
                    }
                };
                update(updatedFunc);

                return { functions: updatedFunc };
            }, () => {
                console.log("Value after insertion:", this.state.functions.inside);
            });
        }
    };

    insertItemOnParam = (obj, indexF, data, position, empty) => {
        if (data != null) {
            let indices = this.findIndices(obj, indexF);
            let parent = null
            this.setState(prevState => {
                const updatedFunc = cloneDeep(prevState.functions);
                let x = 0;
                let addPos = 0

                const update = (updated) => {
                    if (x < indices.length) {
                        x++;
                        parent = updated.inside
                        update(updated.inside[indices[x - 1]]);
                    } else {

                        if (empty) {

                            if (updated.inside.length > 0) {
                                updated.inside.splice(0, 0, data)
                            }
                            else {
                                updated.inside.splice(updated.inside.length, 0, data)
                            }


                            return
                        }
                        if (position === "top") {
                            addPos = 0
                        } else {
                            addPos = 1

                        }


                        parent.splice(indices[x - 1] + addPos, 0, data);


                    }
                };
                update(updatedFunc);

                return { functions: updatedFunc };
            }, () => {
                console.log("Value after insertion:", this.state.functions.inside);
            });
        }
    };


    deleteItem = () => {
        const id = this.state.value.id
        let deleted = false

        this.setState((prevState) => {
            let headers = prevState.cheaders
            headers.map((h, i) => {
                if (h.id === id) {
                    headers.splice(i, 1)
                    deleted = true
                }
                return null
            })
            return { cheaders: headers }
        })


        if (!deleted) {
            this.setState((prevState) => {
                let defines = prevState.defines
                defines.inside.map((d, i) => {
                    if (d.id === id) {
                        defines.inside.splice(i, 1)
                        deleted = true
                    }
                    return null
                })
                return { defines: defines }
            })
        }


        if (!deleted) {
            this.setState((prevState) => {
                let gVars = prevState.gVariables
                gVars.inside.map((v, i) => {
                    if (v.id === id) {
                        gVars.inside.splice(i, 1)
                        deleted = true
                    }
                    return null
                })
                return { gVariables: gVars }
            })
        }

        if (!deleted) {
            this.setState((prevState) => {
                let functions = prevState.functions
                functions.inside.map((f, i) => {
                    if (f.id === id) {
                        functions.inside.splice(i, 1)
                        deleted = true
                    }
                    return null
                })
                return { functions: functions }
            })
        }



        if (!deleted) {
            const indexF = this.state.value.indexF
            const obj = this.findObjectWithID(this.state.value.id)
            let indices = this.findIndices(obj, indexF);

            let parent = null

            this.setState(prevState => {
                const updatedFunc = cloneDeep(prevState.functions);
                let x = 0;

                const update = (updated) => {
                    if (x < indices.length) {
                        x++;
                        parent = updated.inside
                        update(updated.inside[indices[x - 1]]);
                    } else {
                        parent.splice(indices[x - 1], 1);
                    }
                };
                update(updatedFunc);

                return { functions: updatedFunc };
            }, () => {
                console.log("Value after deletion:", this.state.functions.inside);
            });
        }

    };



    //----------------------------------------
    handleonDragStart = (data, inc) => {
        this.setState({ value: data, inc: inc ?? 0 })
    }
    handleOnDrag = () => {

    }

    handleOnDragEnd = () => {

    }
    //---------------------------------------

    handleOnDragEnter = () => {

    }

    handleOnDragOver = (e, divRef) => {
        e.preventDefault();
        e.stopPropagation();
        const div = divRef.current
        const mouseY = e.clientY;
        //console.log(divRef.classList.findIndex((name) => { return name === "sortableLR" }))
        const objectCenterY = div.getBoundingClientRect().top + div.offsetHeight / 2;

        if (div.offsetHeight >= 40) {
            if (mouseY - objectCenterY < 0) {
                div.style.borderTop = '5px solid blue';
                div.style.borderBottom = 'none';
            } else {
                div.style.borderBottom = '5px solid blue';
                div.style.borderTop = 'none';
            }
        }
        else {
            div.style.backgroundColor = "rgba(226,232,240,1)"
        }
    };

    dragOverSortableLR = (e, divRef) => {
        e.preventDefault();
        e.stopPropagation();
        const div = divRef.current
        const mouseY = e.clientX;
        //console.log(divRef.classList.findIndex((name) => { return name === "sortableLR" }))
        const objectCenterX = div.getBoundingClientRect().left + div.offsetWidth / 2;


        if (mouseY - objectCenterX < 0) {
            div.style.borderLeft = '5px solid blue';
            div.style.borderRight = 'none';
        } else {
            div.style.borderRight = '5px solid blue';
            div.style.borderLeft = 'none';
        }

    }

    dragLeaveSortableLR = (e, divRef) => {
        const div = divRef.current


        div.style.borderLeft = 'none';
        div.style.borderRight = 'none';

    }


    handleOnDragLeave = (e, divRef) => {
        const div = divRef.current

        if (div.offsetHeight >= 40) {
            div.style.borderTop = 'none';
            div.style.borderBottom = 'none';
        }
        else {
            div.style.backgroundColor = "rgba(226,232,240,0.6)";
        }

    }
    //---------------------------------------------
    handleOnDrop = (e, obj, indexF, divRef, empty) => {
        let divs = document.querySelectorAll("div.sortable")
        divs.forEach((item) => {
            item.style.borderBottom = 'none'
            item.style.borderTop = 'none'
        })
        e.stopPropagation();
        let data = this.state.value
        this.setState((prevState) => ({ id: prevState.id + prevState.inc }))
        let position = ""
        const div = divRef.current;
        const mouseY = e.clientY;
        const objectCenterY = div.getBoundingClientRect().top + div.offsetHeight / 2;
        if (mouseY - objectCenterY < 0) {
            position = "top"
        } else {
            position = "bottom"
        }
        this.insertItem(obj, indexF, data, position, empty)

    }



    dropOnGVariables = (e, index, divRef, empty) => {
        let divs = document.querySelectorAll("div.sortable")
        divs.forEach((item) => {
            item.style.borderBottom = 'none'
            item.style.borderTop = 'none'
        })
        e.stopPropagation();

        let data = this.state.value
        this.setState((prevState) => {
            return { id: prevState.id + 1 }
        })
        if (empty) {
            this.setState((prevState) => {
                let g = cloneDeep(prevState.gVariables)

                g.inside.push(data)

                return { gVariables: g }
            })
        }

        else {
            const div = divRef.current;
            const mouseY = e.clientY;
            let position = 0
            const objectCenterY = div.getBoundingClientRect().top + div.offsetHeight / 2;
            if (mouseY - objectCenterY < 0) {
                position = 0
            } else {
                position = 1
            }
            this.setState((prevState) => {
                const g = cloneDeep(prevState.gVariables)
                g.inside.splice(index + position, 0, data)
                return { gVariables: g }
            }, () => {
                console.log("State After dropping GVAr:", this.state)
            })

        }
    }
    dropOnHeaders = (e, index, divRef, empty) => {
        let divs = document.querySelectorAll("div.sortable")
        divs.forEach((item) => {
            item.style.borderBottom = 'none'
            item.style.borderTop = 'none'
        })
        e.stopPropagation();

        let data = this.state.value
        this.setState((prevState) => {
            return { id: prevState.id + 1 }
        })

        let position = 0
        if (empty) {
            this.setState((prevState) => {
                return { cheaders: [...prevState.cheaders, data] }
            }, () => {
                console.log("state:", this.state)
            })
        }

        else {
            const div = divRef.current;
            const mouseY = e.clientY;
            const objectCenterY = div.getBoundingClientRect().top + div.offsetHeight / 2;
            if (mouseY - objectCenterY < 0) {
                position = 0
            } else {
                position = 1
            }
            this.setState((prevState) => {
                const g = [...prevState.cheaders]
                g.splice(index + position, 0, data)
                return { cheaders: g }
            })

        }
    }

    dropOnDefine = (e, index, divRef, empty) => {
        let divs = document.querySelectorAll("div.sortable")
        divs.forEach((item) => {
            item.style.borderBottom = 'none'
            item.style.borderTop = 'none'
        })
        e.stopPropagation();

        const data = this.state.value
        this.setState((prevState) => {
            return { id: prevState.id + 1 }
        })
        let position = 0
        if (empty) {
            this.setState((prevState) => {
                let prev = cloneDeep(prevState.defines)
                prev.inside = [...prev.inside, data]
                return { defines: prev }
            }, () => {
                console.log("state:", this.state)
            })
        }

        else {
            const div = divRef.current;
            const mouseY = e.clientY;
            const objectCenterY = div.getBoundingClientRect().top + div.offsetHeight / 2;
            if (mouseY - objectCenterY < 0) {
                position = 0
            } else {
                position = 1
            }
            this.setState((prevState) => {
                const g = cloneDeep(prevState.defines)
                g.inside.splice(index + position, 0, data)
                return { defines: g }
            })

        }
    }

    dropOnSubP = (e, index, divRef, empty) => {
        let divs = document.querySelectorAll("div.sortable")
        divs.forEach((item) => {
            item.style.borderBottom = 'none'
            item.style.borderTop = 'none'
        })
        e.stopPropagation();

        let data = this.state.value
        this.setState((prevState) => {
            return { id: prevState.id + prevState.inc }
        })
        let position = 0
        if (empty) {
            this.setState((prevState) => {
                const func = cloneDeep(prevState.functions)
                func.inside.push(data)
                return { functions: func }
            }, () => {
                console.log("state:", this.state)
            })
        }

        else {
            const div = divRef.current;
            const mouseY = e.clientY;
            const objectCenterY = div.getBoundingClientRect().top + div.offsetHeight / 2;
            if (mouseY - objectCenterY < 0) {
                position = 0
            } else {
                position = 1
            }
            this.setState((prevState) => {
                const func = cloneDeep(prevState.functions)
                func.inside.splice(index + position, 0, data)
                return { functions: func }
            })

        }
    }

    dropOnParams = (e, obj, indexF, divRef, empty) => {
        let divs = document.querySelectorAll("div.sortable")
        divs.forEach((item) => {
            item.style.borderBottom = 'none'
            item.style.borderTop = 'none'
        })
        divs = document.querySelectorAll("div.sortableLR")
        divs.forEach((item) => {
            item.style.borderLeft = 'none'
            item.style.borderRight = 'none'
        })
        e.stopPropagation();
        let data = this.state.value
        data = { ...data, elementType: "param" }
        this.setState((prevState) => ({ id: prevState.id + prevState.inc }))
        let position = ""
        const div = divRef.current;
        const mouseX = e.clientX;
        const objectCenterX = div.getBoundingClientRect().left + div.offsetWidth / 2;
        if (mouseX - objectCenterX < 0) {
            position = "top"
        } else {
            position = "bottom"
        }
        this.insertItemOnParam(obj, indexF, data, position, empty)
        this.setState((prevState) => {
            const funcs = cloneDeep(prevState.functions)
            funcs.inside[indexF].NumberOfParams += 1
            return { functions: funcs }
        })

    }

    dropOnSlot = (e, obj, data, divRef, index) => {
        e.stopPropagation()
        const indices = this.findIndices(obj)


        if (indices.length !== 0) {
            this.setState(prevState => {
                const updatedFunc = cloneDeep(prevState.functions);
                let x = 0;

                console.log("Indicess:", indices)

                const update = (updated) => {
                    if (x < indices.length) {
                        x++;
                        update(updated.inside[indices[x - 1]]);
                    } else {
                        console.log("Updated at:", updated)
                        updated.inside[index] = data
                    }
                };
                update(updatedFunc);


                return { functions: updatedFunc };
            }, () => {
                this.updateEachVariable(index)
                console.log("Value:", this.state.functions.inside);
            });
        }
        else {
            this.setState((prevState) => {
                const updatedGVars = cloneDeep(prevState.gVariables)
                const i = updatedGVars.inside.findIndex((v) => {
                    return v.id === obj.id
                })

                updatedGVars.inside[i].inside[index] = data

                return { gVariables: updatedGVars }
            }, () => {
                this.updateEachGVariable()
                console.log("Gvar updated :", this.state)
            })
        }


    }
    //------------------------------------------

    addDefination = () => {
        this.setState((prevState) => ({
            definations: [...prevState.definations, { "": 0 }]
        }));
    }










    setParamType = (id, i, e) => {
        this.state.functions.inside.find((obj) => obj.id === id).params[i].type = e.target.value;

    }
    setFuncName = (id, e) => {
        this.setState((prevState) => {
            const funcs = cloneDeep(this.state.functions)
            funcs.inside.find((obj => obj.id === id)).type = "1" + e.target.value;

            return { functions: funcs }
        })

    }

    updateVariableName = (obj, indexF, e) => {

        let indices = this.findIndices(obj, indexF);
        this.setState(prevState => {
            const updatedFunc = cloneDeep(prevState.functions);
            let x = 0;

            const update = (updated) => {
                if (x < indices.length) {
                    x++;
                    update(updated.inside[indices[x - 1]]);
                } else {
                    updated.type = e.target.value
                }
            };
            update(updatedFunc);

            return { functions: updatedFunc };
        }, () => {
            console.log("Value after name updated:", this.state.functions.inside);
        });

    }

    updateVariablesDimention = (obj, indexF, e, i) => {

        let indices = this.findIndices(obj, indexF);
        this.setState(prevState => {
            const updatedFunc = cloneDeep(prevState.functions);
            let x = 0;

            const update = (updated) => {
                if (x < indices.length) {
                    x++;
                    update(updated.inside[indices[x - 1]]);
                } else {
                    updated.dimension[i].length = e.target.value
                }
            };
            update(updatedFunc);

            return { functions: updatedFunc };
        }, () => {
            console.log("Value:", this.state.functions.inside);
        });

    }

    updateVariablesValue = (obj, indexF, val, dimention, d) => {

        let indices = this.findIndices(obj, indexF);
        this.setState(prevState => {
            const updatedFunc = cloneDeep(prevState.functions);
            let x = 0;

            const update = (updated) => {
                if (x < indices.length) {
                    x++;
                    update(updated.inside[indices[x - 1]]);
                } else {
                    switch (dimention) {
                        case (1): updated.value[d[0]] = val
                            break
                        case (2): updated.value[d[0]][d[1]] = val
                            break
                        default: updated.value = val
                    }


                }
            };
            update(updatedFunc);

            return { functions: updatedFunc };
        }, () => {
            this.updateEachVariable(indexF)
            console.log("After Updting Variaables value:", this.state.functions.inside);
        });

    }

    updateSign = (e, obj, indexF) => {
        let indices = this.findIndices(obj, indexF);
        this.setState(prevState => {
            const updatedFunc = cloneDeep(prevState.functions);
            let x = 0;

            const update = (updated) => {
                if (x < indices.length) {
                    x++;
                    update(updated.inside[indices[x - 1]]);
                } else {
                    console.log("Updated elemetn:", updated)
                    updated.sign = e.target.value
                }
            };
            update(updatedFunc);

            return { functions: updatedFunc };
        }, () => {
            console.log("After Updting Variaables value:", this.state.functions.inside);
        });
    }



    updateDefinesName = (e, index) => {
        this.setState((prevState) => {
            const defs = cloneDeep(prevState.defines)
            defs.inside[index].type = e.target.value
            return { defines: defs }
        })
    }

    updateDefinesValue = (e, index) => {
        this.setState((prevState) => {
            const defs = cloneDeep(prevState.defines)
            defs.inside[index].value = e.target.value
            return { defines: defs }
        }, () => {
            this.updateEachGVariable()
            console.log("After Updating Defines Value:", this.state)
        })
    }

    updateGVariablesName = (e, index) => {
        this.setState((prevState) => {
            const gVars = cloneDeep(prevState.gVariables)
            gVars.inside[index].type = e.target.value
            return { gVariables: gVars }
        })
    }

    updateGVariablesValue = (obj, val, dimension, d) => {

        this.setState((prevState) => {

            const recurance = (ob) => {
                if (ob.hasOwnProperty("inside")) {
                    for (let j = 0; j < ob.inside.length; j++) {
                        if (ob.inside[j].id === obj.id) {
                            switch (dimension) {
                                case (1): ob.inside[j].value[d[0]] = val
                                    break
                                case (2): ob.inside[j].value[d[0]][d[1]] = val
                                    break
                                default: ob.inside[j].value = val
                            }
                        }
                        else {
                            recurance(ob.inside[j])
                        }
                    }
                }
            }

            let gVars = cloneDeep(prevState.gVariables)
            recurance(gVars)


            return { gVariables: gVars }
        }, () => {
            this.updateEachGVariable();
            console.log("After updating Gvariables Value:", this.state)
        })
    }




    initializeArray = (obj, index, gVariables, value) => {

        console.log("Initilizing:", obj, index, gVariables, value)

        let val = []
        let row = value[0]
        let col = value[1]

        if (obj.inside.length === 2) {
            for (let i = 0; i < row; i++) {
                val.push(0)
            }

        }
        else if (obj.inside.length === 3) {
            for (let i = 0; i < row; i++) {
                let tmp = []
                for (let j = 0; j < col; j++) {
                    tmp.push(0)
                }
                val.push(tmp)
            }
        }


        if (gVariables) {
            this.updateGVariablesValue(obj, val)
        }
        else {
            this.updateVariablesValue(obj, index, val, 0)
        }

    }


    returnArry = (v) => {
        return `{${v.value.map((r) => (Array.isArray(r) ? "{" + r.map((c) => (c)).join(",") + "}" : r)).join(",")}}`
    }



    returnGlobalVariables = () => {
        return `${this.state.gVariables.inside.map((g) => {
            return `${g.dataType} ${g.type}${g.inside.map((ins, i) => (i > 0 ? "[" + (ins.refId ? this.findObjectWithID(ins.refId).type : ins.value) + "]" : null)).join("")} = ${g.inside.length > 1 ? this.returnArry(g) : (g.value ?? 0)};\n`
        }).join("")}`
    }
    returnParams = (func) => {
        return func.inside.map((p, i) => (i < func.NumberOfParams ? `${(i !== 0 ? "," : "")} ${p.dataType} ${p.type}` : null)).join("")
    }

    showVar = (v, indexF) => {
        return `${v.dataType} ${v.type}${v.inside.map((ins, i) => (i > 0 ? "[" + (ins.refId ? this.findObjectWithID(ins.refId).type : ins.value) + "]" : null)).join("")} = ${v.inside[0].type === "arithmatic" ? this.showArithmatic(v.inside[0], indexF) : (`${v.inside.length > 1 ? this.returnArry(v) : (v.value ?? 0)}`)};\n    `
    }
    showArray = (a) => {

        return `${a.inside.map((ins, i) => (i > 0 ? "[" + (ins.refId ? this.findObjectWithID(ins.refId).type : ins.value) + "]" : null)).join("")}`
    }
    showCondition = (cond, i, indexF) => {
        return `${cond.inside[i].inside[0].refId ? this.findObjectWithID(cond.inside[i].inside[0].refId, indexF).type + this.showArray(cond.inside[i].inside[0]) : cond.inside[i].inside[0].value} ${cond.inside[i].sign} ${cond.inside[i].inside[1].refId ? this.findObjectWithID(cond.inside[i].inside[1].refId, indexF).type + this.showArray(cond.inside[i].inside[1]) : cond.inside[i].inside[1].value}`
    }
    showConditionals = (cond, index) => {
        if (cond.type === "cif") {
            return `if(${this.showCondition(cond, 0, index)}){
        ${cond.inside.filter((obj, i) => i > 0).map((obj) => {
                return this.showInners(obj, index)
            }).join("\n")}
    }`
        }
        else {
            return `else{
        ${cond.inside.map((obj, i) => {
                return this.showInners(obj, index)
            }).join("\n")}
    }`
        }
    }

    showLoops = (l, index) => {
        if (l.type === "cfor") {
            return `for(${this.showCondition(l, 0, index)}; ${this.showCondition(l, 1, index)};${this.showCondition(l, 2, index)}){
        ${l.inside.filter((obj, i) => i > 2).map((obj) => {
                return this.showInners(obj, index)
            }).join("\n")}
    }`
        }
        else if (l.type === "cwhile") {
            return `while(${this.showCondition(l, 0, index)}){
        ${l.inside.filter((obj, i) => i > 0).map((obj) => {
                return this.showInners(obj, index)
            }).join("\n")}
    }`
        }
        else {
            return `do{
        ${l.inside.filter((obj, i) => i > 0).map((obj) => {
                return this.showInners(obj, index)
            }).join("\n")}
    }
    while(${this.showCondition(l, 0, index)});`
        }
    }

    showFunction = (func, indexF, withoutComma) => {
        return `${func.type.slice(1)}(${func.inside.map((p) => (p.inside[0].refId ? this.findObjectWithID(p.inside[0].refId).type : p.inside[0].value))})${withoutComma ? null : ";"}`
    }
    showArithmatic = (obj, indexF) => {
        return `(${obj.inside[0].type === "arithmatic" ? this.showArithmatic(obj.inside[0], indexF) : (`${obj.inside[0].refId ? this.findObjectWithID(obj.inside[0].refId, indexF).type : obj.inside[0].value}`)} ${obj.sign} ${obj.inside[1].type === "arithmatic" ? this.showArithmatic(obj, indexF) : (`${obj.inside[1].refId ? this.findObjectWithID(obj.inside[1].refId, indexF).type : obj.inside[1].value}`)})`
    }


    showAssignment = (obj, indexF) => {
        return `${obj.inside[0].refId ? this.findObjectWithID(obj.inside[0].refId, indexF).type : obj.inside[0].value} ${obj.sign} ${obj.inside[1].type === "arithmatic" ? this.showArithmatic(obj.inside[1], indexF) : obj.inside[1].elementType === "function" ? this.showFunction(obj.inside[1], indexF, true) : (`${obj.inside[1].refId ? this.findObjectWithID(obj.inside[1].refId, indexF).type : obj.inside[1].value}`)};`
    }

    showReturn = (obj, indexF) => {
        return `return ${obj.inside[0].type === "arithmatic" ? this.showArithmatic(obj.inside[0], indexF) : (`${obj.inside[0].refId ? this.findObjectWithID(obj.inside[0].refId, indexF).type : obj.inside[0].value}`)};`
    }

    showInners = (obj, indexF) => {
        switch (obj.elementType) {
            case ("variableBtn"): return this.showVar(obj, indexF)
            case ("conditional"): return this.showConditionals(obj, indexF)
            case ("loop"): return this.showLoops(obj, indexF)
            case ("function"): return this.showFunction(obj, indexF)
            case ("expression"): return obj.type === "return" ? (this.showReturn(obj, indexF)) : (this.showAssignment(obj, indexF))
            default: return ""
        }
    }

    returnFunctions = () => {
        return `${this.state.functions.inside.map((f, index) => {
            return f.defination ? `${f.returnType} ${f.type.slice(1)}(${this.returnParams(f)}){         
    ${f.inside.map((obj, i) => {
                if (i >= f.NumberOfParams) {
                    return this.showInners(obj, index)
                }
                else {
                    return null
                }
            }).join("\n    ")}
}\n` : null
        }).join("")}`
    }

    updateEachGVariable = () => {
        const l = this.state.gVariables.inside.length

        const updateVar = (i) => {
            this.setState((prevState) => {
                let gVars = cloneDeep(prevState.gVariables)
                let v = gVars.inside[i]

                const findValue = (obj, i) => {
                    return obj.inside[i].hasOwnProperty("refId") ? obj.inside[i].refId === null ? (obj.inside[i].value ?? 0) : this.findObjectWithID(obj.inside[i].refId).value : 0
                }

                switch (v.inside.length) {
                    case (2): {
                        const row = v.inside[1].refId === null ? v.inside[1].value : findValue(v, 1)
                        const len = v.value.length

                        if (len < parseInt(row)) {
                            for (let i = len; i < row; i++) {
                                v.value.push(0)
                            }
                        }
                        else {
                            v.value.splice(row - 1, len - row)
                        }

                    }
                        break



                    case (3): {
                        const row = v.inside[1].refId === null ? v.inside[1].value : findValue(v, 1)
                        const col = v.inside[2].refId === null ? v.inside[2].value : findValue(v, 2)

                        const lenR = v.value.length

                        console.log("lenR,row:", lenR, row)

                        if (lenR < parseInt(row)) {
                            for (let i = lenR; i < row; i++) {
                                const lenC = Array.isArray(v.value[i]) ? v.value[i].length : 0
                                console.log("lenC,col:", lenC, col)

                                let tmp = Array.isArray(v.value[i]) ? v.value[i] : []


                                if (lenC < parseInt(col)) {
                                    console.log("Trreeeeeeeeeeeeeeue")
                                    for (let j = lenC; j < col; j++) {
                                        tmp.push(0)
                                    }
                                }
                                else {
                                    if (Array.isArray(v.value[i])) {
                                        v.value[i].splice(col - 1, lenC - col)
                                    }
                                }

                                v.value.push(tmp)
                            }
                        }
                        else {
                            v.value.splice(row - 1, lenR - row)
                            for (let i = 0; i < row; i++) {
                                const lenC = Array.isArray(v.value[i]) ? v.value[i].length : 0
                                console.log("lenC,col:", lenC, col)

                                let tmp = Array.isArray(v.value[i]) ? v.value[i] : []


                                if (lenC < parseInt(col)) {
                                    console.log("Trreeeeeeeeeeeeeeue")
                                    for (let j = lenC; j < col; j++) {
                                        tmp.push(0)
                                    }
                                }
                                else {
                                    if (Array.isArray(v.value[i])) {
                                        v.value[i].splice(col - 1, lenC - col)
                                    }
                                }
                            }

                        }
                    }
                        break



                    default: {
                        v.value = v.inside[0].refId === null ? v.inside[0].value : findValue(v, 0)
                    }
                }


                return { gVariables: gVars }
            }, () => {
                if (i < l - 1) {
                    updateVar(i + 1)
                }
                else {
                    this.updateEachVariable(0)
                }
                console.log("gVariables Updateddddd:", this.state)
            })

        }

        this.state.gVariables.inside.map((v, i) => {
            updateVar(i)
            return null
        })

    }

    updateEachVariable = (indexF) => {
        const l = this.state.functions.inside[indexF].inside.length

        const updateVar = (i) => {
            this.setState((prevState) => {
                let funcs = cloneDeep(prevState.functions)
                let v = funcs.inside[indexF].inside[i]

                const findValue = (obj, i) => {
                    return obj.inside[i].hasOwnProperty("refId") ? obj.inside[i].refId === null ? (obj.inside[i].value ?? 0) : this.findObjectWithID(obj.inside[i].refId, indexF).value : 0
                }

                if (v.elementType === "variableBtn") {
                    switch (v.inside.length) {
                        case (2): {
                            const row = v.inside[1].refId === null ? v.inside[1].value : findValue(v, 1)
                            const len = v.value.length

                            if (len < parseInt(row)) {
                                for (let i = len; i < row; i++) {
                                    v.value.push(0)
                                }
                            }
                            else {
                                v.value.splice(row - 1, len - row)
                            }

                        }
                            break



                        case (3): {
                            const row = v.inside[1].refId === null ? v.inside[1].value : findValue(v, 1)
                            const col = v.inside[2].refId === null ? v.inside[2].value : findValue(v, 2)

                            const lenR = v.value.length


                            if (lenR < parseInt(row)) {
                                for (let i = lenR; i < row; i++) {
                                    const lenC = Array.isArray(v.value[i]) ? v.value[i].length : 0

                                    let tmp = Array.isArray(v.value[i]) ? v.value[i] : []


                                    if (lenC < parseInt(col)) {
                                        for (let j = lenC; j < col; j++) {
                                            tmp.push(0)
                                        }
                                    }
                                    else {
                                        if (Array.isArray(v.value[i])) {
                                            v.value[i].splice(col - 1, lenC - col)
                                        }
                                    }

                                    v.value.push(tmp)
                                }
                            }
                            else {
                                v.value.splice(row - 1, lenR - row)
                                for (let i = 0; i < row; i++) {
                                    const lenC = Array.isArray(v.value[i]) ? v.value[i].length : 0

                                    let tmp = Array.isArray(v.value[i]) ? v.value[i] : []


                                    if (lenC < parseInt(col)) {
                                        for (let j = lenC; j < col; j++) {
                                            tmp.push(0)
                                        }
                                    }
                                    else {
                                        if (Array.isArray(v.value[i])) {
                                            v.value[i].splice(col - 1, lenC - col)
                                        }
                                    }
                                }

                            }
                        }
                            break



                        default: {
                            console.log("Updating local variable v:",v)
                            v.value = v.inside[0].refId === null ? v.inside[0].value : findValue(v, 0)
                        }
                    }
                    return { functions: funcs }
                }

            }, () => {
                if (i + 1 < l) {
                    updateVar(i + 1)
                }
                console.log("gVariables Updateddddd:", this.state)
            })

        }

        this.state.functions.inside[indexF].inside.map((v, i) => {
            updateVar(i)
            return null
        })

    }




    render() {



        // Function to handle API call
        const handleRunButtonClick = () => {
            console.log("Stttess:", this.state)
            let code =
                `${this.state.cheaders.map((h) => ("#include<" + h.type + ">;")).join('\n')}\n
${this.state.defines.inside.map((d) => ("#define " + d.type + " " + (d.value ?? 0))).join('\n')}\n
${this.state.functions.inside.map((f) =>
                    f.defination && f.type !== "1main" ?
                        `${f.returnType} ${f.type.slice(1)}(${f.inside.map((p, i) => i < f.NumberOfParams ? (i !== 0 ? "," : "") + " " + p.dataType : null).join("")});\n`
                        : null
                ).join("")}
${this.returnGlobalVariables()}
${this.returnFunctions()}
`


            /*const code = 
            `
            #include<stdio.h>
            int main()
            {
                printf("Hello World from C");
                    return 0;
            }
            `;*/

            this.setState((prevState) => {
                return { showOutput: !prevState.showOutput, code: code }
            })



            // Get your code from state or wherever it's stored
            const input = ""; // Get your input data from state or wherever it's stored
            const inputRadio = false; // Get your input radio value from state or wherever it's stored

            fetch('http://localhost:8080/compilecode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    input: input,
                    inputRadio: inputRadio
                })
            })
                .then(response => response.text())
                .then(data => {
                    this.setState((prevState) => {
                        return { responseData: data }
                    })
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        };



        const showArray = (obj, index, gVariables) => {


            let items = []
            items.push("{")



            let val0 = obj.inside[1].refId === null ? obj.inside[1].value
                : this.findObjectWithID(obj.inside[1].refId, index).value

            let val1 = null

            if (obj.inside.length === 3) {
                val1 = obj.inside[2].refId === null ? obj.inside[2].value
                    : this.findObjectWithID(obj.inside[2].refId, index).value
            }


            if (obj.value.length === parseInt(val0)) {

                for (let i = 0; i < val0; i++) {
                    if (i !== 0) {
                        items.push(",")
                    }
                    if (obj.inside.length === 3) {
                        items.push("{")


                        if (Array.isArray(obj.value[i]) && obj.value[i].length === parseInt(val1)) {
                            for (let j = 0; j < val1; j++) {
                                if (j !== 0) {
                                    items.push(",")
                                }
                                items.push(<input
                                    className="w-4 rounded-md autoAdjust"
                                    onChange={(e) => {
                                        this.adjustInputWidth()
                                        if (gVariables) {
                                            this.updateGVariablesValue(obj, e.target.value, 2, [i, j])
                                        }
                                        else {
                                            this.updateVariablesValue(obj, index, e.target.value, 2, [i, j])
                                        }

                                    }}
                                    defaultValue={obj.value[i][j]}
                                />)
                            }
                        }
                        items.push("}")

                    }
                    else {
                        items.push(<input
                            className="w-4 rounded-md autoAdjust"
                            onChange={(e) => {
                                this.adjustInputWidth()
                                if (gVariables) {
                                    this.updateGVariablesValue(obj, e.target.value, 1, [i])
                                }
                                else {
                                    this.updateVariablesValue(obj, index, e.target.value, 1, [i])
                                }
                            }}
                            defaultValue={obj.value[i]}
                        />)
                    }
                }

            }

            items.push("}")
            return items;

        }


        const variable = (obj, index, gVariables) => {

            return (<div className="flex items-center">
                {obj.dataType}
                <input
                    onChange={(e) => {
                        this.variableName(e);
                        this.adjustInputWidth(e);
                        if (gVariables) {
                            this.updateGVariablesName(e, index)
                        }
                        else {
                            this.updateVariableName(obj, index, e)
                        }

                    }}
                    value={obj.type}
                    className="w-10  bg-transparent outline-none border-2 border-slate-50 m-2 autoAdjust"
                    draggable="true"
                    onDragStart={(e) => {
                        e.stopPropagation()
                        const data = { id: this.state.id, refId: obj.id, dataType: obj.dataType, type: obj.type, value: obj.value, inside: obj.inside, indicator: false, elementType: "variable" }
                        this.handleonDragStart(data, 1)
                    }}
                />

                {obj.inside.map((l, i) => {
                    if (i > 0) {
                        const divRef = React.createRef();
                        return <div className="bg-slate-200 flex w-max px-1  rounded-md border-x-2 border-black slot"
                            ref={divRef}
                            onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                            onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                            onDrop={(e) => {
                                const data = {
                                    id: this.state.id,
                                    refId: this.state.value.refId ?? null,
                                    type: this.state.value.type,
                                    inside: this.state.value.inside,
                                    value: this.state.value.value ?? null
                                }
                                this.setState((prevState) => {
                                    return { id: prevState.id + 1 }
                                })
                                this.dropOnSlot(e, obj, data, divRef, i)
                            }}
                        >


                            {

                                (() => {
                                    switch (obj.inside[i].type) {
                                        case ("intInput"): return (
                                            <input
                                                className="w-5 bg-slate-200 text-center autoAdjust"
                                                onChange={(e) => {
                                                    this.adjustInputWidth()
                                                    if (gVariables) {
                                                        this.updateGVariablesValue(obj.inside[i], e.target.value)
                                                    }
                                                    else {
                                                        this.updateVariablesValue(obj.inside[i], index, e.target.value, 0)
                                                        
                                                    }


                                                }}
                                                value={obj.inside[i].value}
                                            />)
                                        case ("floatInput"): return (<input />)
                                        case ("charInput"): return (<input />)
                                        default: {
                                            const refVer = this.findObjectWithID(obj.inside[i].refId, index)
                                            return obj.inside[i].hasOwnProperty("refId") ?
                                                refVer.type
                                                : <p>{"   "}</p>
                                        }
                                    }
                                })()
                            }


                        </div>
                    }
                    else {
                        return null
                    }

                })}

                =
                {obj.inside.length === 1 ?
                    (() => {
                        const divRef = React.createRef()
                        return (
                            <div className="bg-slate-200 flex w-max min-w-5  rounded-sm slot"
                                ref={divRef}
                                onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                                onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                                onDrop={(e) => {
                                    let data = null
                                    this.state.value.type === "arithmatic" ?
                                        data = this.state.value
                                        :
                                        data = {
                                            id: this.state.id,
                                            refId: this.state.value.refId ?? null,
                                            type: this.state.value.type,
                                            inside: [{}],//this.state.value.inside,
                                            value: 0//this.state.value.value
                                        }
                                    this.setState((prevState) => {
                                        return { id: prevState.id + 1 }
                                    })
                                    this.dropOnSlot(e, obj, data, divRef, 0)
                                }}
                            >

                                {
                                    (() => {
                                        switch (obj.inside[0].type) {
                                            case ("intInput"): return (
                                                <input
                                                    className="w-5 bg-slate-200 autoAdjust"
                                                    onChange={(e) => {
                                                        this.adjustInputWidth()
                                                        if (gVariables) {
                                                            this.updateGVariablesValue(obj.inside[0], e.target.value, 0)
                                                            this.updateEachGVariable();


                                                        }
                                                        else {
                                                            this.updateVariablesValue(obj.inside[0], index, e.target.value, 0)
                                                            this.updateEachVariable(index)
                                                        }
                                                    }}
                                                />)
                                            case ("floatInput"): return (<input />)
                                            case ("charInput"): return (<input />)
                                            case ("arithmatic"): return (arithmatic(obj.inside[0]))
                                            default: return obj.inside[0].hasOwnProperty("refId") ? (
                                                () => {
                                                    const tmp = []
                                                    const elmnt = this.findObjectWithID(obj.inside[0].refId, index)
                                                    tmp.push(elmnt.type)

                                                    obj.inside[0].hasOwnProperty("inside") ?
                                                        obj.inside[0].inside.map((l, i) => {
                                                            if (i > 0) {
                                                                const divRef = React.createRef();
                                                                tmp.push(<div className="bg-slate-200 flex w-max px-1  rounded-md border-x-2 border-black slot"
                                                                    ref={divRef}
                                                                    onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                                                                    onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                                                                    onDrop={(e) => {
                                                                        const data = {
                                                                            id: this.state.id,
                                                                            refId: this.state.value.refId ?? null,
                                                                            type: this.state.value.type,
                                                                            inside: this.state.value.inside,
                                                                            value: this.state.value.value ?? null
                                                                        }
                                                                        this.setState((prevState) => {
                                                                            return { id: prevState.id + 1 }
                                                                        })
                                                                        this.dropOnSlot(e, obj.inside[0], data, divRef, i)
                                                                    }}
                                                                >


                                                                    {

                                                                        (() => {
                                                                            switch (obj.inside[0].inside[i].type) {
                                                                                case ("intInput"): return (
                                                                                    <input
                                                                                        className="w-5 bg-slate-200 autoAdjust"
                                                                                        onChange={(e) => {
                                                                                            this.adjustInputWidth()
                                                                                            this.updateVariablesValue(obj.inside[0].inside[i], index, e.target.value, 0)
                                                                                        }}
                                                                                    />)
                                                                                case ("floatInput"): return (<input />)
                                                                                case ("charInput"): return (<input />)
                                                                                case ("arithmatic"): return (arithmatic(obj.inside[0].inside[i]))
                                                                                default: return obj.inside[0].inside[i].hasOwnProperty("refId") ?
                                                                                    this.findObjectWithID(obj.inside[0].inside[i].refId, index).type
                                                                                    : <p>{"   "}</p>
                                                                            }
                                                                        })()
                                                                    }

                                                                </div>)
                                                                return null
                                                            }
                                                            else {
                                                                return null
                                                            }

                                                        }) : <p>{"   "}</p>

                                                    return tmp
                                                }
                                            )()
                                                : <p>{"   "}</p>
                                        }
                                    })()
                                }


                            </div>)
                    })()
                    :
                    showArray(obj, index, gVariables)
                }

                ;
            </div>)
        }



        const viewReturn = (obj, indexF) => {
            const divRef = React.createRef()
            return (<div className="flex">
                <div className="mr-4">return</div>
                <div className="bg-slate-200 flex w-max  rounded-sm slot"
                    ref={divRef}
                    onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                    onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                    onDrop={(e) => {
                        let data = null
                        this.state.value.type === "arithmatic" ?
                            data = this.state.value
                            :
                            data = {
                                id: this.state.id,
                                refId: this.state.value.refId ?? null,
                                type: this.state.value.type,
                                inside: this.state.value.inside,
                                value: this.state.value.value ?? null
                            }
                        this.setState((prevState) => {
                            return { id: prevState.id + 1 }
                        })
                        this.dropOnSlot(e, obj, data, divRef, 0)
                    }}
                >

                    {
                        (() => {
                            switch (obj.inside[0].type) {
                                case ("intInput"): return (
                                    <input
                                        className="w-5 bg-slate-200 autoAdjust"
                                        onChange={(e) => {
                                            this.adjustInputWidth()
                                            this.updateVariablesValue(obj.inside[0], indexF, e.target.value, 0)
                                        }}
                                    />)
                                case ("floatInput"): return (<input />)
                                case ("charInput"): return (<input />)
                                case ("arithmatic"): return (arithmatic(obj.inside[0]))
                                default:
                                    return obj.inside[0].hasOwnProperty("refId") ? (
                                        () => {
                                            const tmp = []
                                            const elmnt = this.findObjectWithID(obj.inside[0].refId, indexF)
                                            tmp.push(elmnt.type)

                                            obj.inside[0].hasOwnProperty("inside") ?
                                                obj.inside[0].inside.map((l, i) => {
                                                    if (i > 0) {
                                                        const divRef = React.createRef();
                                                        tmp.push(<div className="bg-slate-200 flex w-max px-1  rounded-md border-x-2 border-black slot"
                                                            ref={divRef}
                                                            onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                                                            onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                                                            onDrop={(e) => {
                                                                const data = {
                                                                    id: this.state.id,
                                                                    refId: this.state.value.refId ?? null,
                                                                    type: this.state.value.type,
                                                                    inside: this.state.value.inside,
                                                                    value: this.state.value.value ?? null
                                                                }
                                                                this.setState((prevState) => {
                                                                    return { id: prevState.id + 1 }
                                                                })
                                                                this.dropOnSlot(e, obj.inside[0], data, divRef, i)
                                                            }}
                                                        >


                                                            {

                                                                (() => {
                                                                    switch (obj.inside[0].inside[i].type) {
                                                                        case ("intInput"): return (
                                                                            <input
                                                                                className="w-5 bg-slate-200 autoAdjust"
                                                                                onChange={(e) => {
                                                                                    this.adjustInputWidth()
                                                                                    this.updateVariablesValue(obj.inside[0], indexF, e.target.value, 0)
                                                                                }}
                                                                            />)
                                                                        case ("floatInput"): return (<input />)
                                                                        case ("charInput"): return (<input />)
                                                                        case ("arithmatic"): return (arithmatic(obj.inside[1].inside[i]))
                                                                        default: return obj.inside[0].inside[i].hasOwnProperty("refId") ?
                                                                            this.findObjectWithID(obj.inside[0].inside[i].refId, indexF).type
                                                                            : <p>{"   "}</p>
                                                                    }
                                                                })()
                                                            }

                                                        </div>)
                                                        return null
                                                    }
                                                    else {
                                                        return null
                                                    }

                                                }) : <p>{"   "}</p>

                                            return tmp
                                        }
                                    )()
                                        : <p>{"   "}</p>
                            }
                        })()
                    }

                </div>

            </div>)

        }











        const showInside = (obj, indexF, startingIndex) => {
            const colorList = [
                "bg-blue-200",
                "bg-cyan-200",
                "bg-sky-200",
                "bg-blue-300",
                "bg-cyan-300",
                "bg-sky-300",
                "bg-blue-400",
                "bg-cyan-400",
                "bg-sky-400",
            ];


            return obj.inside && obj.inside.map((im, i) => {
                if (i >= startingIndex) {
                    const divRef = React.createRef();
                    const depth = this.findIndices(im).length
                    switch (im.type) {
                        case "assignment":
                            return <div
                                draggable="true"
                                ref={divRef}
                                className={`pl-2 py-2 rounded-lg my-1  border-gray-400 border-l-2 ${colorList[depth - 2]} sortable`}
                                onDragOver={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDragOver(e, divRef)
                                    }
                                }}
                                onDrop={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDrop(e, im, indexF, divRef)
                                    }
                                }}
                                onDragLeave={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDragLeave(e, divRef)
                                    }
                                }}
                                onDragStart={(e) => {
                                    e.stopPropagation()
                                    const data = { id: im.id, indexF: indexF, dataType: "", type: '', value: null, inside: [{}], indicator: false, elementType: "floating" }
                                    this.handleonDragStart(data, 0)
                                }}>{assignment(im, indexF)}</div>;
                        case "cif":
                            return <div
                                draggable="true"
                                ref={divRef}
                                className={`pl-2 rounded-lg  border-gray-400 border-l-2 ${colorList[depth - 2]} sortable`}
                                onDragOver={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDragOver(e, divRef)
                                    }
                                }}
                                onDrop={(e) => {

                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDrop(e, im, indexF, divRef)
                                    }
                                }}
                                onDragLeave={(e) => {

                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDragLeave(e, divRef)
                                    }
                                }}
                                onDragStart={(e) => {
                                    e.stopPropagation()
                                    const data = { id: im.id, indexF: indexF, dataType: "", type: '', value: null, inside: [{}], indicator: false, elementType: "floating" }
                                    this.handleonDragStart(data, 0)
                                }}
                            >{cif(im, indexF)}</div>;
                        case "celse":
                            return <div
                                draggable="true"
                                ref={divRef}
                                className={`pl-2 rounded-lg my-1  border-gray-400 border-l-2 ${colorList[depth - 2]} sortable`}
                                onDragOver={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDragOver(e, divRef)
                                    }
                                }}
                                onDrop={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDrop(e, im, indexF, divRef)
                                    }
                                }}
                                onDragLeave={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDragLeave(e, divRef)
                                    }
                                }}
                                onDragStart={(e) => {
                                    e.stopPropagation()
                                    const data = { id: im.id, indexF: indexF, dataType: "", type: '', value: null, inside: [{}], indicator: false, elementType: "floating" }
                                    this.handleonDragStart(data, 0)
                                }}>{celse(im, indexF)}</div>;
                        case "cfor":
                            return <div
                                draggable="true"
                                ref={divRef}
                                className={`pl-2 rounded-lg my-1  border-gray-400 border-l-2 ${colorList[depth - 2]} sortable`}
                                onDragOver={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDragOver(e, divRef)
                                    }
                                }}
                                onDrop={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDrop(e, im, indexF, divRef)
                                    }
                                }}
                                onDragLeave={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDragLeave(e, divRef)
                                    }
                                }}
                                onDragStart={(e) => {
                                    e.stopPropagation()
                                    const data = { id: im.id, indexF: indexF, dataType: "", type: '', value: null, inside: [{}], indicator: false, elementType: "floating" }
                                    this.handleonDragStart(data, 0)
                                }}
                            >
                                {cfor(im, indexF)}
                            </div>

                        case "cwhile":
                            return <div
                                ref={divRef}
                                draggable="true"
                                className={`pl-2 rounded-lg my-1  border-gray-400 border-l-2 ${colorList[depth - 2]} sortable`}
                                onDragOver={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDragOver(e, divRef)
                                    }
                                }}
                                onDrop={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDrop(e, im, indexF, divRef)
                                    }
                                }}
                                onDragLeave={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDragLeave(e, divRef)
                                    }
                                }}
                                onDragStart={(e) => {
                                    e.stopPropagation()
                                    const data = { id: im.id, indexF: indexF, dataType: "", type: '', value: null, inside: [{}], indicator: false, elementType: "floating" }
                                    this.handleonDragStart(data, 0)
                                }}
                            >
                                {cwhile(im, indexF)}
                            </div>;
                        case "return":
                            return <div
                                ref={divRef}
                                draggable="true"
                                className={`pl-2 flex items-center min-h-10 rounded-lg my-1  border-gray-400 border-l-2 ${colorList[depth - 2]} sortable`}
                                onDragOver={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDragOver(e, divRef)
                                    }
                                }}
                                onDrop={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDrop(e, im, indexF, divRef)
                                    }
                                }}
                                onDragLeave={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDragLeave(e, divRef)
                                    }
                                }}
                                onDragStart={(e) => {
                                    e.stopPropagation()
                                    const data = { id: im.id, indexF: indexF, dataType: "", type: '', value: null, inside: [{}], indicator: false, elementType: "floating" }
                                    this.handleonDragStart(data, 0)
                                }}
                            >
                                {viewReturn(im, indexF)}
                            </div>;

                        case "cdoWhile":
                            return <div
                                ref={divRef}
                                draggable="true"
                                className={`pl-2 rounded-lg my-1 border-gray-400 border-l-2  ${colorList[depth - 2]} sortable`}
                                onDragOver={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDragOver(e, divRef)
                                    }
                                }}
                                onDrop={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDrop(e, im, indexF, divRef)
                                    }
                                }}
                                onDragLeave={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDragLeave(e, divRef)
                                    }
                                }}
                                onDragStart={(e) => {
                                    e.stopPropagation()
                                    const data = { id: im.id, indexF: indexF, dataType: "", type: '', value: null, inside: [{}], indicator: false, elementType: "floating" }
                                    this.handleonDragStart(data, 0)
                                }}
                            >
                                {cdoWhile(im, indexF)}
                            </div>
                        default:
                            if (im.type[0] === '1') {
                                return (
                                    <div
                                        id={i}
                                        ref={divRef}
                                        draggable="true"
                                        className={`pl-2 rounded-lg my-1 border-gray-400 border-l-2  ${colorList[depth - 2]} sortable`}
                                        onDragOver={(e) => {
                                            this.handleOnDragOver(e, divRef)
                                        }}
                                        onDrop={(e) => {
                                            this.handleOnDrop(e, im, indexF, divRef)
                                        }}
                                        onDragLeave={(e) => {
                                            this.handleOnDragLeave(e, divRef)
                                        }}
                                        onDragStart={(e) => {
                                            e.stopPropagation()
                                            const data = { id: im.id, indexF: indexF, dataType: "", type: '', value: null, inside: [{}], indicator: false, elementType: "floating" }
                                            this.handleonDragStart(data, 0)
                                        }}>
                                        {funcCall(im, indexF, false)}
                                    </div>
                                );
                            }
                            else {
                                return < div
                                    draggable="true"
                                    ref={divRef}
                                    className={`pl-2 rounded-lg my-1  border-gray-400 border-l-2 ${colorList[depth - 2]} sortable`}
                                    onDragOver={(e) => {
                                        this.handleOnDragOver(e, divRef)
                                    }}
                                    onDrop={(e) => {
                                        this.handleOnDrop(e, im, indexF, divRef)
                                    }}
                                    onDragLeave={(e) => {
                                        this.handleOnDragLeave(e, divRef)
                                    }}
                                    onDragStart={(e) => {
                                        e.stopPropagation()
                                        const data = { id: im.id, indexF: indexF, dataType: "", type: '', value: null, inside: [{}], indicator: false, elementType: "floating" }
                                        this.handleonDragStart(data, 0)
                                    }}>{variable(im, indexF, false)}</div>;
                            }
                    }
                }
                else {
                    return null
                }
            })
        }


        const funcCall = (func, indexF, assign) => {
            if (!func) {
                return null;
            }

            return (
                <div className={` ${assign ? "py-0" : "py-2 min-h-10"} flex`}>
                    {func.type.slice(1)}(
                    <div className=" flex">
                        {
                            (() => {
                                const tmp = []
                                func.inside.map((p, i) => {
                                    if (i < func.NumberOfParams) {
                                        const divRef = React.createRef()

                                        if (i !== 0) {
                                            tmp.push(",")
                                        }

                                        tmp.push(<div className="flex min-w-4">
                                            <div className=" w-max min-w-4 rounded-sm slot"
                                                ref={divRef}
                                                onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                                                onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                                                onDrop={(e) => {
                                                    const data = {
                                                        id: this.state.id,
                                                        refId: this.state.value.refId ?? null,
                                                        type: this.state.value.type,
                                                        value: this.state.value.value ?? null
                                                    }
                                                    this.setState((prevState) => {
                                                        return { id: prevState.id + 1 }
                                                    })
                                                    console.log("droping in the positin:", p)
                                                    this.dropOnSlot(e, p, data, divRef, 0)
                                                }}
                                            >

                                                {
                                                    (() => {
                                                        switch (p.inside[0].type) {
                                                            case ("intInput"): return (
                                                                <input
                                                                    className="min-w-5 bg-slate-200 autoAdjust"
                                                                    onChange={(e) => {
                                                                        this.adjustInputWidth()
                                                                        this.updateVariablesValue(p.inside[0], indexF, e.target.value)
                                                                    }}
                                                                    value={p.inside[0].value}
                                                                />)
                                                            case ("floatInput"): return (<input />)
                                                            case ("charInput"): return (<input />)
                                                            default: return p.inside[0].refId !== null ?
                                                                this.findObjectWithID(p.inside[0].refId, indexF).type
                                                                : <p>{"   "}</p>
                                                        }
                                                    })()
                                                }
                                            </div>
                                        </div>)
                                        return null
                                    }
                                    else {
                                        return null
                                    }

                                })
                                return tmp
                            })()
                        }

                    </div>
                    );
                </div>
            );
        };


        const showGVariables = () => {
            const divRef = React.createRef();
            return <div
                className="bg-slate-200 my-1 mr-0  min-h-5 sortable"
                ref={divRef}
                onDragOver={(e) => {
                    if (this.state.value.elementType === "variableBtn") {
                        this.handleOnDragOver(e, divRef)
                    }
                }}
                onDrop={(e) => {
                    if (this.state.value.elementType === "variableBtn") {
                        this.dropOnGVariables(e, null, divRef, true) //empty=true as empty section
                    }
                }}
                onDragLeave={(e) => {
                    if (this.state.value.elementType === "variableBtn") {
                        this.handleOnDragLeave(e, divRef)
                    }
                }}>
                {this.state.gVariables.inside.map((v, i) => {
                    const divRef = React.createRef();
                    return (<div
                        className="bg-blue-200 pl-2 rounded-lg my-1  border-gray-400 border-l-2 sortable"
                        ref={divRef}
                        draggable="true"
                        onDragOver={(e) => {
                            if (this.state.value.elementType === "variableBtn") {
                                this.handleOnDragOver(e, divRef)
                            }
                        }}
                        onDrop={(e) => {
                            if (this.state.value.elementType === "variableBtn") {
                                this.dropOnGVariables(e, i, divRef, false) //empty=false as non empty section
                            }
                        }}
                        onDragLeave={(e) => {
                            if (this.state.value.elementType === "variableBtn") {
                                this.handleOnDragLeave(e, divRef)
                            }
                        }}
                        onDragStart={(e) => {
                            e.stopPropagation()
                            const data = { id: v.id, indexF: null, dataType: "", type: '', value: null, inside: [{}], indicator: false, elementType: "floating" }
                            this.handleonDragStart(data, 0)
                        }}>
                        {variable(v, i, true)}
                    </div>)
                })}
            </div>
        }

        const showHeaders = () => {
            const divRef = React.createRef();
            return <div
                className="bg-slate-200 my-1 mr-0  min-h-5 "
                ref={divRef}
                onDragOver={(e) => {
                    if (this.state.value.elementType === "header") {
                        this.handleOnDragOver(e, divRef)

                    }
                }}
                onDrop={(e) => {
                    if (this.state.value.elementType === "header") {
                        this.dropOnHeaders(e, null, divRef, true) //empty=true as empty section

                    }
                }}
                onDragLeave={(e) => {
                    if (this.state.value.elementType === "header") {
                        this.handleOnDragLeave(e, divRef)

                    }
                }}>
                {this.state.cheaders.map((h, i) => {
                    const divRef = React.createRef();
                    return (<div
                        className=" flex items-center bg-blue-200 pl-2 rounded-lg my-1 min-h-10  border-gray-400 border-l-2 sortable"
                        ref={divRef}
                        draggable="true"
                        onDragOver={(e) => {
                            if (this.state.value.elementType === "header") {
                                this.handleOnDragOver(e, divRef)

                            }
                        }}
                        onDrop={(e) => {
                            if (this.state.value.elementType === "header") {
                                this.dropOnHeaders(e, i, divRef, false) //empty=false as non empty section

                            }
                        }}
                        onDragLeave={(e) => {
                            if (this.state.value.elementType === "header") {
                                this.handleOnDragLeave(e, divRef)

                            }
                        }}
                        onDragStart={(e) => {
                            e.stopPropagation()
                            const data = { id: h.id, indexF: null, dataType: "", type: '', value: null, inside: [{}], indicator: false, elementType: "floating" }
                            this.handleonDragStart(data, 0)
                        }}>
                        {<p>#include &lt;{h.type}&gt;</p>}
                    </div>)
                })}
            </div>
        }

        const showDefines = () => {
            const divRef = React.createRef();
            return <div
                className="bg-slate-200 my-1 mr-0 min-h-5 sortable"
                ref={divRef}
                onDragOver={(e) => {
                    if (this.state.value.elementType === "defineBtn") {
                        this.handleOnDragOver(e, divRef)

                    }
                }}
                onDrop={(e) => {
                    if (this.state.value.elementType === "defineBtn") {
                        this.dropOnDefine(e, null, divRef, true) //empty=true as empty section

                    }
                }}
                onDragLeave={(e) => {
                    if (this.state.value.elementType === "defineBtn") {
                        this.handleOnDragLeave(e, divRef)

                    }
                }}>
                {this.state.defines.inside.map((d, i) => {
                    const divRef = React.createRef();

                    return (
                        <div
                            className="bg-blue-200 pl-2 rounded-lg my-1  border-gray-400 border-l-2 sortable"
                            ref={divRef}
                            draggable="true"
                            onDragOver={(e) => {
                                if (this.state.value.elementType === "defineBtn") {
                                    this.handleOnDragOver(e, divRef)
                                }
                            }}
                            onDrop={(e) => {
                                if (this.state.value.elementType === "defineBtn") {
                                    this.dropOnDefine(e, i, divRef, false) //empty=false as non empty section
                                }
                            }}
                            onDragLeave={(e) => {
                                if (this.state.value.elementType === "defineBtn") {
                                    this.handleOnDragLeave(e, divRef)
                                }
                            }}
                            onDragStart={(e) => {
                                e.stopPropagation()
                                const data = { id: d.id, indexF: null, dataType: "", type: '', value: null, inside: [{}], indicator: false, elementType: "floating" }
                                this.handleonDragStart(data, 0)
                            }}>

                            #define
                            <input
                                onChange={(e) => {
                                    this.variableName(e);
                                    this.adjustInputWidth(e);
                                    this.updateDefinesName(e, i);
                                }}
                                value={d.type}
                                className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                                draggable="true"
                                onDragStart={() => {
                                    const data = { id: this.state.id, refId: d.id, dataType: d.dataType, type: d.type, value: d.value, inside: d.inside, indicator: false, elementType: "variable" }

                                    console.log("Dataaaa:", data)
                                    this.handleonDragStart(data, 1)
                                }}
                            />
                            <input
                                onChange={(e) => {
                                    this.floatValue(e);
                                    this.adjustInputWidth(e);
                                    this.updateDefinesValue(e, i)

                                }}
                                value={d.value}
                                className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                            />

                            ;

                        </div>
                    )
                })}
            </div>

        }

        const showSubprograms = () => {
            const divRef = React.createRef();
            return (
                <div className="bg-slate-200 my-1 mr-0  min-h-5 sortable"
                    ref={divRef}
                    onDragOver={(e) => {
                        if (this.state.value.elementType === "functionBtn") {
                            this.handleOnDragOver(e, divRef)
                        }
                    }}
                    onDrop={(e) => {
                        if (this.state.value.elementType === "functionBtn") {
                            this.dropOnSubP(e, null, divRef, true) //empty=true as empty section
                        }
                    }}
                    onDragLeave={(e) => {
                        if (this.state.value.elementType === "functionBtn") {
                            this.handleOnDragLeave(e, divRef)
                        }
                    }}>
                    {this.state.functions.inside.map((f, index) => {
                        const divRef = React.createRef()
                        return (
                            index === 0 || !f.defination ? null :
                                <div
                                    id={f.id}
                                    className="bg-blue-200 rounded-lg my-1  border-gray-400 border-l-2 sortable"
                                    ref={divRef}
                                    draggable="true"
                                    onDragOver={(e) => {
                                        if (this.state.value.elementType === "functionBtn") {
                                            this.handleOnDragOver(e, divRef)
                                        }
                                    }}
                                    onDrop={(e) => {
                                        if (this.state.value.elementType === "functionBtn") {
                                            this.dropOnSubP(e, index, divRef, false) //empty=false as non empty section
                                        }
                                    }}
                                    onDragLeave={(e) => {
                                        if (this.state.value.elementType === "functionBtn") {
                                            this.handleOnDragLeave(e, divRef)
                                        }
                                    }}
                                    onDragStart={(e) => {
                                        e.stopPropagation()
                                        const data = { id: f.id, indexF: null, dataType: "", type: '', value: null, inside: [{}], indicator: false, elementType: "floating" }
                                        this.handleonDragStart(data, 0)
                                    }}
                                >
                                    {subP(f.id)}
                                </div>
                        )
                    })}
                </div>
            )
        }


        const subP = (id) => {
            const obj = this.state.functions.inside.find((obj) => obj.id === id);
            const index = this.state.functions.inside.indexOf(obj);
            const divRef = React.createRef();
            return (
                <div className=" pl-2 bg-blue-300 flex items-center rounded-lg sortable">
                    <code className="w-full">
                        <div className="flex">
                            {obj.returnType}
                            <input
                                className="w-10 bg-transparent outline-none border-2 autoAdjust ml-5"

                                onChange={(e) => {
                                    if (id !== 0) {
                                        this.setFuncName(id, e);
                                        this.adjustInputWidth();
                                    }
                                }}
                                value={obj.type.slice(1)}
                            ></input>
                            {"("}
                            <div
                                className="bg-blue-200 rounded-lg  min-w-5 min-h-4  sortable"
                                ref={divRef}
                                onDragOver={(e) => {
                                    this.handleOnDragOver(e, divRef)
                                }}
                                onDrop={(e) => {
                                    this.dropOnParams(e, obj, index, divRef, true)
                                }}
                                onDragLeave={(e) => {
                                    this.handleOnDragLeave(e, divRef)
                                }}

                            >
                                {obj.inside.map((p, i) => {
                                    const divRef = React.createRef()
                                    if (i < obj.NumberOfParams) {
                                        return (
                                            <div id={i}
                                                className="items-center inline-flex bg-blue-200 rounded-lg min-w-4 sortableLR"
                                                ref={divRef}
                                                onDragOver={(e) => {
                                                    this.dragOverSortableLR(e, divRef)
                                                }}
                                                onDrop={(e) => {
                                                    this.dropOnParams(e, p, index, divRef, false)
                                                }}
                                                onDragLeave={(e) => {
                                                    this.dragLeaveSortableLR(e, divRef)
                                                }}
                                                draggable="true"
                                                onDragStart={() => {
                                                    const data = { id: this.state.id, refId: p.id, dataType: p.dataType, type: p.type, value: p.value, inside: p.inside, indicator: false, elementType: "variable" }
                                                    this.handleonDragStart(data, 1)
                                                }}
                                            >
                                                {i !== 0 && <p>,</p>}
                                                {p.dataType}
                                                <input
                                                    className="w-20 bg-transparent outline-none border-2 autoAdjust ml-2"
                                                    defaultValue={p.type}
                                                    onChange={(e) => {
                                                        this.adjustInputWidth();
                                                        this.updateVariableName(p, index, e);
                                                    }}
                                                />

                                            </div>
                                        )
                                    }
                                    else {
                                        return null
                                    }
                                })}

                            </div>
                            {") {"}
                        </div>
                        {(() => {
                            const divRef = React.createRef()
                            return (<div className="bg-slate-200 ml-4 mr-0 min-h-4"
                                ref={divRef}
                                onDragOver={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDragOver(e, divRef)
                                    }
                                }}
                                onDrop={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDrop(e, obj, index, divRef, true)
                                    }
                                }}
                                onDragLeave={(e) => {
                                    const et = this.state.value.elementType
                                    if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                        this.handleOnDragLeave(e, divRef)
                                    }
                                }}
                            >

                                {
                                    showInside(obj, index, obj.NumberOfParams)    //show the elements inside subP
                                }
                            </div>)
                        })()}

                        <p>{"}"}</p>
                    </code>
                </div>
            );
        };


        const conditional = (obj, indexF) => {
            console.log("Conditional object got:", this.state)
            const divRef = React.createRef()
            return (<div className="flex">
                <div className="bg-slate-200 flex w-max  rounded-sm slot"
                    ref={divRef}
                    onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                    onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                    onDrop={(e) => {
                        const data = {
                            id: this.state.id,
                            refId: this.state.value.refId ?? null,
                            type: this.state.value.type,
                            inside: this.state.value.inside,
                            value: this.state.value.value ?? null
                        }
                        this.setState((prevState) => {
                            return { id: prevState.id + 1 }
                        })
                        console.log("Dropped with the values:", obj, data, this.state.value)
                        this.dropOnSlot(e, obj, data, divRef, 0)
                    }}
                >

                    {
                        (() => {
                            if (obj.inside[0] && obj.inside[0].hasOwnProperty("type")) {
                                switch (obj.inside[0].type) {
                                    case ("intInput"): return (
                                        <input
                                            className="w-5 bg-slate-200 autoAdjust"
                                            onChange={(e) => {
                                                this.adjustInputWidth()
                                                this.updateVariablesValue(obj.inside[0], indexF, e.target.value, 0)
                                            }}
                                            value={obj.inside[0].value}
                                        />)
                                    case ("floatInput"): return (<input />)
                                    case ("charInput"): return (<input />)
                                    case ("arithmatic"): return (arithmatic(obj.inside[0]))
                                    default: return obj.inside[0].hasOwnProperty("refId") ? (
                                        () => {
                                            const tmp = []
                                            const elmnt = this.findObjectWithID(obj.inside[0].refId, indexF)
                                            console.log("dfskkf skjfhskhfksdhfshfdksfks dkdf:", obj.inside[0], elmnt)
                                            tmp.push(elmnt.type)

                                            obj.inside[0].hasOwnProperty("inside") ?
                                                obj.inside[0].inside.map((l, i) => {
                                                    if (i > 0) {
                                                        const divRef = React.createRef();
                                                        tmp.push(<div className="bg-slate-200 flex w-max px-1  rounded-md border-x-2 border-black slot"
                                                            ref={divRef}
                                                            onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                                                            onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                                                            onDrop={(e) => {
                                                                const data = {
                                                                    id: this.state.id,
                                                                    refId: this.state.value.refId ?? null,
                                                                    type: this.state.value.type,
                                                                    inside: this.state.value.inside,
                                                                    value: this.state.value.value ?? null
                                                                }
                                                                this.setState((prevState) => {
                                                                    return { id: prevState.id + 1 }
                                                                })
                                                                this.dropOnSlot(e, obj.inside[0], data, divRef, i)
                                                            }}
                                                        >


                                                            {

                                                                (() => {
                                                                    switch (obj.inside[0].inside[i].type) {
                                                                        case ("intInput"): return (
                                                                            <input
                                                                                className="w-5 bg-slate-200 autoAdjust"
                                                                                onChange={(e) => {
                                                                                    this.adjustInputWidth()
                                                                                    this.updateVariablesValue(obj.inside[0].inside[i], indexF, e.target.value)
                                                                                }}
                                                                            />)
                                                                        case ("floatInput"): return (<input />)
                                                                        case ("charInput"): return (<input />)
                                                                        case ("arithmatic"): return (arithmatic(obj.inside[1].inside[i]))
                                                                        default: return obj.inside[0].inside[i].hasOwnProperty("refId") ?
                                                                            this.findObjectWithID(obj.inside[0].inside[i].refId, indexF).type
                                                                            : <p>{"   "}</p>
                                                                    }
                                                                })()
                                                            }

                                                        </div>)

                                                    }
                                                    return null
                                                }) : <p>{"   "}</p>

                                            return tmp
                                        }
                                    )()
                                        : <p>{"   "}</p>
                                }
                            }
                        })()
                    }


                </div>
                <select
                    className="appearance-none bg-slate-200"
                    onChange={(e) => {
                        this.updateSign(e, obj, indexF)
                    }}
                    value={this.findObjectWithID(obj, indexF)}
                >
                    <option>{'=='}</option>
                    <option>{'<='}</option>
                    <option>{'>='}</option>
                    <option>{'<'}</option>
                    <option>{'>'}</option>
                    <option>{'!='}</option>
                </select>
                <div className="bg-slate-200 flex w-max  rounded-sm slot"
                    ref={divRef}
                    onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                    onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                    onDrop={(e) => {
                        const data = {
                            id: this.state.id,
                            refId: this.state.value.refId ?? null,
                            type: this.state.value.type,
                            inside: this.state.value.inside,
                            value: this.state.value.value ?? null
                        }
                        this.setState((prevState) => {
                            return { id: prevState.id + 1 }
                        })
                        this.dropOnSlot(e, obj, data, divRef, 1)
                    }}
                >


                    {
                        (() => {
                            if (obj.inside[1] && obj.inside[1].hasOwnProperty("type")) {
                                switch (obj.inside[1].type) {
                                    case ("intInput"): return (
                                        <input
                                            className="w-5 bg-slate-200 autoAdjust"
                                            onChange={(e) => {
                                                this.adjustInputWidth()
                                                this.updateVariablesValue(obj.inside[1], indexF, e.target.value, 0)
                                            }}
                                            value={obj.inside[1].value}
                                        />)
                                    case ("floatInput"): return (<input />)
                                    case ("charInput"): return (<input />)
                                    case ("arithmatic"): return (arithmatic(obj.inside[1]))
                                    default: return obj.inside[1].hasOwnProperty("refId") ? (
                                        () => {
                                            const tmp = []
                                            const elmnt = this.findObjectWithID(obj.inside[1].refId, indexF)
                                            tmp.push(elmnt.type)

                                            obj.inside[1].hasOwnProperty("inside") ?
                                                obj.inside[1].inside.map((l, i) => {
                                                    if (i > 0) {
                                                        const divRef = React.createRef();
                                                        tmp.push(<div className="bg-slate-200 flex w-max px-1  rounded-md border-x-2 border-black slot"
                                                            ref={divRef}
                                                            onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                                                            onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                                                            onDrop={(e) => {
                                                                const data = {
                                                                    id: this.state.id,
                                                                    refId: this.state.value.refId ?? null,
                                                                    type: this.state.value.type,
                                                                    inside: this.state.value.inside,
                                                                    value: this.state.value.value ?? null
                                                                }
                                                                this.setState((prevState) => {
                                                                    return { id: prevState.id + 1 }
                                                                })
                                                                this.dropOnSlot(e, obj.inside[1], data, divRef, i)
                                                            }}
                                                        >


                                                            {

                                                                (() => {
                                                                    switch (obj.inside[1].inside[i].type) {
                                                                        case ("intInput"): return (
                                                                            <input
                                                                                className="w-5 bg-slate-200 autoAdjust"
                                                                                onChange={(e) => {
                                                                                    this.adjustInputWidth()
                                                                                    this.updateVariablesValue(obj.inside[1].inside[i], indexF, e.target.value)
                                                                                }}
                                                                            />)
                                                                        case ("floatInput"): return (<input />)
                                                                        case ("charInput"): return (<input />)
                                                                        case ("arithmatic"): return (arithmatic(obj.inside[1].inside[i]))
                                                                        default: return obj.inside[1].inside[i].hasOwnProperty("refId") ?
                                                                            this.findObjectWithID(obj.inside[1].inside[i].refId, indexF).type
                                                                            : <p>{"   "}</p>
                                                                    }
                                                                })()
                                                            }

                                                        </div>)
                                                    }

                                                    return null
                                                }) : <p>{"   "}</p>

                                            return tmp
                                        }
                                    )()
                                        : <p>{"   "}</p>
                                }
                            }
                        })()
                    }

                </div>
            </div>)
        }



        const arithmatic = (obj, indexF) => {
            const divRef = React.createRef()
            return (<div className="flex">
                (
                <div className="bg-slate-200 flex w-max  rounded-sm slot"
                    ref={divRef}
                    onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                    onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                    onDrop={(e) => {
                        let data = null
                        this.state.value.type === "arithmatic" ?
                            data = this.state.value
                            :
                            data = {
                                id: this.state.id,
                                refId: this.state.value.refId ?? null,
                                type: this.state.value.type,
                                inside: this.state.value.inside,
                                value: this.state.value.value ?? null
                            }
                        this.setState((prevState) => {
                            return { id: prevState.id + 1 }
                        })
                        this.dropOnSlot(e, obj, data, divRef, 0)
                    }}
                >

                    {
                        (() => {
                            switch (obj.inside[0].type) {
                                case ("intInput"): return (
                                    <input
                                        className="w-5 bg-slate-200 autoAdjust"
                                        onChange={(e) => {
                                            this.adjustInputWidth()
                                            this.updateVariablesValue(obj.inside[0], indexF, e.target.value, 0)
                                        }}
                                    />)
                                case ("floatInput"): return (<input />)
                                case ("charInput"): return (<input />)
                                case ("arithmatic"): return (arithmatic(obj.inside[0]))
                                default:
                                    return obj.inside[0].hasOwnProperty("refId") ? (
                                        () => {
                                            const tmp = []
                                            const elmnt = this.findObjectWithID(obj.inside[0].refId, indexF)
                                            tmp.push(elmnt.type)

                                            obj.inside[0].hasOwnProperty("inside") ?
                                                obj.inside[0].inside.map((l, i) => {
                                                    if (i > 0) {
                                                        const divRef = React.createRef();
                                                        tmp.push(<div className="bg-slate-200 flex w-max px-1  rounded-md border-x-2 border-black slot"
                                                            ref={divRef}
                                                            onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                                                            onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                                                            onDrop={(e) => {
                                                                const data = {
                                                                    id: this.state.id,
                                                                    refId: this.state.value.refId ?? null,
                                                                    type: this.state.value.type,
                                                                    inside: this.state.value.inside,
                                                                    value: this.state.value.value ?? null
                                                                }
                                                                this.setState((prevState) => {
                                                                    return { id: prevState.id + 1 }
                                                                })
                                                                this.dropOnSlot(e, obj.inside[0], data, divRef, i)
                                                            }}
                                                        >


                                                            {

                                                                (() => {
                                                                    switch (obj.inside[0].inside[i].type) {
                                                                        case ("intInput"): return (
                                                                            <input
                                                                                className="w-5 bg-slate-200 autoAdjust"
                                                                                onChange={(e) => {
                                                                                    this.adjustInputWidth()
                                                                                    this.updateVariablesValue(obj.inside[0], indexF, e.target.value, 0)
                                                                                }}
                                                                            />)
                                                                        case ("floatInput"): return (<input />)
                                                                        case ("charInput"): return (<input />)
                                                                        case ("arithmatic"): return (arithmatic(obj.inside[1].inside[i]))
                                                                        default: return obj.inside[0].inside[i].hasOwnProperty("refId") ?
                                                                            this.findObjectWithID(obj.inside[0].inside[i].refId, indexF).type
                                                                            : <p>{"   "}</p>
                                                                    }
                                                                })()
                                                            }

                                                        </div>)
                                                        return null
                                                    }
                                                    else {
                                                        return null
                                                    }

                                                }) : <p>{"   "}</p>

                                            return tmp
                                        }
                                    )()
                                        : <p>{"   "}</p>
                            }
                        })()
                    }

                </div>
                <select className="appearance-none bg-slate-200 px-1 "
                    onChange={(e) => {
                        this.updateSign(e, obj, indexF)
                    }}
                >
                    <option>{'+'}</option>
                    <option>{'-'}</option>
                    <option>{'*'}</option>
                    <option>{'/'}</option>
                    <option>{'%'}</option>
                </select>
                <div className="bg-slate-200 flex w-max  rounded-sm slot"
                    ref={divRef}
                    onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                    onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                    onDrop={(e) => {
                        let data = null
                        this.state.value.type === "arithmatic" ?
                            data = this.state.value
                            :
                            data = {
                                id: this.state.id,
                                refId: this.state.value.refId ?? null,
                                type: this.state.value.type,
                                inside: this.state.value.inside,
                                value: this.state.value.value ?? null
                            }
                        this.setState((prevState) => {
                            return { id: prevState.id + 1 }
                        })
                        this.dropOnSlot(e, obj, data, divRef, 1)
                    }}
                >


                    {

                        (() => {
                            switch (obj.inside[1].type) {
                                case ("intInput"): return (
                                    <input
                                        className="w-5 bg-slate-200 autoAdjust"
                                        onChange={(e) => {
                                            this.adjustInputWidth()
                                            this.updateVariablesValue(obj.inside[1], indexF, e.target.value, 0)
                                        }}
                                    />)
                                case ("floatInput"): return (<input />)
                                case ("charInput"): return (<input />)
                                case ("arithmatic"): return (arithmatic(obj.inside[1]))
                                default: return obj.inside[1].hasOwnProperty("refId") ? (
                                    () => {
                                        const tmp = []
                                        const elmnt = this.findObjectWithID(obj.inside[1].refId, indexF)
                                        tmp.push(elmnt.type)

                                        obj.inside[1].hasOwnProperty("inside") ?
                                            obj.inside[1].inside.map((l, i) => {
                                                if (i > 0) {
                                                    const divRef = React.createRef();
                                                    tmp.push(<div className="bg-slate-200 flex w-max px-1  rounded-md border-x-2 border-black slot"
                                                        ref={divRef}
                                                        onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                                                        onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                                                        onDrop={(e) => {
                                                            const data = {
                                                                id: this.state.id,
                                                                refId: this.state.value.refId ?? null,
                                                                type: this.state.value.type,
                                                                inside: this.state.value.inside,
                                                                value: this.state.value.value ?? null
                                                            }
                                                            this.setState((prevState) => {
                                                                return { id: prevState.id + 1 }
                                                            })
                                                            this.dropOnSlot(e, obj.inside[1], data, divRef, i)
                                                        }}
                                                    >


                                                        {

                                                            (() => {
                                                                switch (obj.inside[1].inside[i].type) {
                                                                    case ("intInput"): return (
                                                                        <input
                                                                            className="w-5 bg-slate-200 autoAdjust"
                                                                            onChange={(e) => {
                                                                                this.adjustInputWidth()
                                                                                this.updateVariablesValue(obj.inside[1], indexF, e.target.value, 0)
                                                                            }}
                                                                        />)
                                                                    case ("floatInput"): return (<input />)
                                                                    case ("charInput"): return (<input />)
                                                                    case ("arithmatic"): return (arithmatic(obj.inside[1].inside[i]))
                                                                    default: return obj.inside[1].inside[i].hasOwnProperty("refId") ?
                                                                        this.findObjectWithID(obj.inside[1].inside[i].refId, indexF).type
                                                                        : <p>{"   "}</p>
                                                                }
                                                            })()
                                                        }

                                                    </div>)
                                                    return null
                                                }
                                                else {
                                                    return null
                                                }

                                            }) : <p>{"   "}</p>

                                        return tmp
                                    }
                                )()
                                    : <p>{"   "}</p>
                            }
                        })()
                    }


                </div>)
            </div>)
        }



        const assignment = (obj, indexF) => {
            const divRef = React.createRef()
            return (<div className="flex ">
                <div className="bg-slate-200 flex w-max min-w-4  rounded-sm slot"
                    ref={divRef}
                    onDragOver={(e) => {
                        this.handleOnDragOver(e, divRef)

                    }}
                    onDragLeave={(e) => {
                        this.handleOnDragLeave(e, divRef)

                    }}
                    onDrop={(e) => {
                        const ins = []
                        let inc = 1

                        this.state.value.inside.forEach(item => {

                            ins.push({ id: this.state.id + inc })
                            inc++;
                        });

                        const data = {
                            id: this.state.id,
                            refId: this.state.value.refId,
                            type: this.state.value.type,
                            inside: ins,
                            value: this.state.value.value
                        }
                        this.setState((prevState) => ({ id: prevState.id + inc }))
                        this.dropOnSlot(e, obj, data, divRef, 0)

                    }}
                >

                    {obj.inside[0].refId !== null ?
                        this.findObjectWithID(obj.inside[0].refId, indexF).type
                        : null}

                    {
                        obj.inside[0].hasOwnProperty("inside") ?
                            obj.inside[0].inside.map((l, i) => {
                                if (i > 0) {
                                    const divRef = React.createRef();
                                    return <div className="bg-slate-200 flex w-max px-1  rounded-md border-x-2 border-black slot"
                                        ref={divRef}
                                        onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                                        onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                                        onDrop={(e) => {
                                            const data = {
                                                id: this.state.id,
                                                refId: this.state.value.refId ?? null,
                                                type: this.state.value.type,
                                                inside: this.state.value.inside,
                                                value: this.state.value.value ?? null
                                            }
                                            this.setState((prevState) => {
                                                return { id: prevState.id + 1 }
                                            })
                                            this.dropOnSlot(e, obj.inside[0], data, divRef, i)
                                        }}
                                    >


                                        {

                                            (() => {
                                                switch (obj.inside[0].inside[i].type) {
                                                    case ("intInput"): return (
                                                        <input
                                                            className="w-5 bg-slate-200 autoAdjust"
                                                            onChange={(e) => {
                                                                this.adjustInputWidth()
                                                                this.updateVariablesValue(obj.inside[0].inside[i], indexF, e.target.value, 0)
                                                            }}
                                                        />)
                                                    case ("floatInput"): return (<input />)
                                                    case ("charInput"): return (<input />)
                                                    default: return obj.inside[0].inside[i].hasOwnProperty("refId") ?
                                                        this.findObjectWithID(obj.inside[0].inside[i].refId, indexF).type
                                                        : <p>{"   "}</p>
                                                }
                                            })()
                                        }

                                    </div>
                                }
                                else {
                                    return null
                                }


                            }) : <p>{"   "}</p>}

                </div>
                <select className="appearance-none bg-slate-200 px-1 "
                    onChange={(e) => {
                        this.updateSign(e, obj, indexF)
                    }}
                    value={this.findObjectWithID(obj, indexF)}
                >
                    <option>{'='}</option>
                    <option>{'+='}</option>
                    <option>{'-='}</option>
                    <option>{'*='}</option>
                    <option>{'/='}</option>
                    <option>{'++'}</option>
                    <option>{'--'}</option>
                </select>
                <div className="bg-slate-200 flex w-max min-w-5  rounded-sm slot"
                    ref={divRef}
                    onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                    onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                    onDrop={(e) => {
                        let data = null
                        this.state.value.type === "arithmatic" || this.state.value.elementType === "function" ?
                            data = this.state.value
                            :
                            data = {
                                id: this.state.id,
                                refId: this.state.value.refId ?? null,
                                type: this.state.value.type,
                                inside: this.state.value.inside,
                                value: this.state.value.value ?? null
                            }
                        this.setState((prevState) => {
                            return { id: prevState.id + 10 }
                        })
                        this.dropOnSlot(e, obj, data, divRef, 1)
                    }}
                >

                    {
                        (() => {
                            switch (obj.inside[1].type) {
                                case ("intInput"): return (
                                    <input
                                        className="w-5 bg-slate-200 autoAdjust"
                                        onChange={(e) => {
                                            this.adjustInputWidth()
                                            this.updateVariablesValue(obj.inside[1], indexF, e.target.value, 0)
                                        }}
                                    />)
                                case ("floatInput"): return (<input />)
                                case ("charInput"): return (<input />)
                                case ("arithmatic"): return (arithmatic(obj.inside[1]))
                                default:
                                    if (obj.inside[1].elementType === "function") {
                                        return funcCall(obj.inside[1], indexF, true)
                                    }
                                    else {
                                        return obj.inside[1].hasOwnProperty("refId") ? (
                                            () => {
                                                const tmp = []
                                                const elmnt = this.findObjectWithID(obj.inside[1].refId, indexF)
                                                tmp.push(elmnt.type)

                                                obj.inside[1].hasOwnProperty("inside") ?
                                                    obj.inside[1].inside.map((l, i) => {
                                                        const divRef = React.createRef();
                                                        tmp.push(<div className="bg-slate-200 flex w-max px-1  rounded-md border-x-2 border-black slot"
                                                            ref={divRef}
                                                            onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                                                            onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                                                            onDrop={(e) => {
                                                                const data = {
                                                                    id: this.state.id,
                                                                    refId: this.state.value.refId ?? null,
                                                                    type: this.state.value.type,
                                                                    inside: this.state.value.inside,
                                                                    value: this.state.value.value ?? null
                                                                }
                                                                this.setState((prevState) => {
                                                                    return { id: prevState.id + 1 }
                                                                })
                                                                this.dropOnSlot(e, obj.inside[1], data, divRef, i)
                                                            }}
                                                        >


                                                            {

                                                                (() => {
                                                                    switch (obj.inside[1].inside[i].type) {
                                                                        case ("intInput"): return (
                                                                            <input
                                                                                className="w-5 bg-slate-200 autoAdjust"
                                                                                onChange={(e) => {
                                                                                    this.adjustInputWidth()
                                                                                    this.updateVariablesValue(obj.inside[1].inside[i], indexF, e.target.value, 0)
                                                                                }}
                                                                            />)
                                                                        case ("floatInput"): return (<input />)
                                                                        case ("charInput"): return (<input />)
                                                                        case ("arithmatic"): return (arithmatic(obj.inside[1].inside[i]))
                                                                        default: return obj.inside[1].inside[i].hasOwnProperty("refId") ?
                                                                            this.findObjectWithID(obj.inside[1].inside[i].refId, indexF).type
                                                                            : <p>{"   "}</p>
                                                                    }
                                                                })()
                                                            }

                                                        </div>)
                                                        return null
                                                    }) : <p>{"   "}</p>

                                                return tmp
                                            }
                                        )()
                                            : <p>{"   "}</p>
                                    }

                            }
                        })()
                    }


                </div>

            </div>)
        }



        const cif = (obj, indexF) => {
            const divRef = React.createRef();
            return (
                <div>
                    <div className="h-7 flex rounded-lg">
                        <p className="inline-block">if(</p>
                        <div className="border-2 border-slate-100">{conditional(obj.inside[0], indexF)}</div>
                        <p className="inline-block">){"{"}</p>
                    </div>
                    <div className="bg-slate-200 my-1 ml-5 mr-0  min-h-5"
                        ref={divRef}
                        onDragOver={(e) => {
                            const et = this.state.value.elementType
                            if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                this.handleOnDragOver(e, divRef)
                            }
                        }}
                        onDrop={(e) => {
                            const et = this.state.value.elementType
                            if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                this.handleOnDrop(e, obj, indexF, divRef, true)
                            }
                        }}
                        onDragLeave={(e) => {
                            const et = this.state.value.elementType
                            if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                this.handleOnDragLeave(e, divRef)
                            }
                        }}>
                        {showInside(obj, indexF, 1)}
                    </div>
                    {"}"}
                </div>)
        }

        const celse = (obj, indexF) => {
            const divRef = React.createRef();
            return (
                <div>
                    else{'{'}

                    <div className="bg-slate-200 my-1 ml-5 mr-0  min-h-5"
                        ref={divRef}
                        onDragOver={(e) => {
                            const et = this.state.value.elementType
                            if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                this.handleOnDragOver(e, divRef)
                            }
                        }}
                        onDrop={(e) => {
                            const et = this.state.value.elementType
                            if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                this.handleOnDrop(e, obj, indexF, divRef, true)
                            }
                        }}
                        onDragLeave={(e) => {
                            const et = this.state.value.elementType
                            if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                this.handleOnDragLeave(e, divRef)
                            }
                        }}>
                        {showInside(obj, indexF, 0)}
                    </div>
                    {'}'}
                </div>
            )
        }



        const cfor = (obj, indexF) => {
            const divRef = React.createRef();
            return (
                <div>
                    <div className="h-7 flex rounded-lg">
                        for(
                        <div className="border-2 border-slate-100">{assignment(obj.inside[0], indexF)}</div>
                        ;
                        <div className="border-2 border-slate-100">{conditional(obj.inside[1], indexF)}</div>
                        ;
                        <div className="border-2 border-slate-100">{assignment(obj.inside[2], indexF)}</div>
                        ){'{'}</div>

                    <div className="bg-slate-200 my-1 ml-5 mr-0  min-h-5"
                        ref={divRef}
                        onDragOver={(e) => {
                            const et = this.state.value.elementType
                            if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                this.handleOnDragOver(e, divRef)
                            }
                        }}
                        onDrop={(e) => {
                            const et = this.state.value.elementType
                            if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                this.handleOnDrop(e, obj, indexF, divRef, true)
                            }
                        }}
                        onDragLeave={(e) => {
                            const et = this.state.value.elementType
                            if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                this.handleOnDragLeave(e, divRef)
                            }
                        }}>
                        {showInside(obj, indexF, 3)}
                    </div>
                    {'}'}
                </div>)
        }






        const cwhile = (obj, indexF) => {
            const divRef = React.createRef();
            return (
                <div>
                    <div className="h-7 flex rounded-lg">
                        while(
                        <div className="border-2 border-slate-100">{conditional(obj.inside[0], indexF)}</div>
                        ){'{'}</div>
                    <div className="bg-slate-200 my-1 ml-5 mr-0 min-h-5"
                        ref={divRef}
                        onDragOver={(e) => {
                            const et = this.state.value.elementType
                            if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                this.handleOnDragOver(e, divRef)
                            }
                        }}
                        onDrop={(e) => {
                            const et = this.state.value.elementType
                            if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                this.handleOnDrop(e, obj, indexF, divRef, true)
                            }
                        }}
                        onDragLeave={(e) => {
                            const et = this.state.value.elementType
                            if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                this.handleOnDragLeave(e, divRef)
                            }
                        }}>
                        {showInside(obj, indexF, 1)}
                    </div>

                    {'}'}
                </div>
            )
        }

        const cdoWhile = (obj, indexF) => {
            const divRef = React.createRef();
            return (
                <div>
                    do{'{'}
                    <div className="bg-slate-200 my-1 ml-5 mr-0  min-h-5"
                        ref={divRef}
                        onDragOver={(e) => {
                            const et = this.state.value.elementType
                            if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                this.handleOnDragOver(e, divRef)
                            }
                        }}
                        onDrop={(e) => {
                            const et = this.state.value.elementType
                            if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                this.handleOnDrop(e, obj, indexF, divRef, true)
                            }
                        }}
                        onDragLeave={(e) => {
                            const et = this.state.value.elementType
                            if (et === "variableBtn" || et === "expression" || et === "function" || et === "conditional" || et === "loop") {
                                this.handleOnDragLeave(e, divRef)
                            }
                        }}>
                        {showInside(obj, indexF, 1)}
                    </div>

                    {'}'}
                    <br />
                    <div className="h-7 flex rounded-lg">
                        while(
                        <div className="border-2 border-slate-100">{conditional(obj.inside[0], indexF)}</div>
                        ){');'}</div>
                </div>
            )
        }

        /*
        ********************************************************************************************************************************
        */
        const inputField = (id) => { return { id: id, refId: null, dataType: "int", type: "intInput", value: 0, inside: [], indicator: false, elementType: "inputField" } }

        const assign = (id) => { return { id: id, type: "assignment", sign: "=", inside: [{}, inputField(id + 2)], indicator: false, elementType: "assignment" } }
        const condition = (id) => { return { id: id, type: "conditional", sign: "==", inside: [inputField(id + 1), inputField(id + 2)], indicator: false, elementType: "conditional" } }

        return (
            <div className="bg-slate-700  flex">
                {!this.state.showOutput && (
                    <div className=" p-5  bg-slate-400 w-1/4 h-screen overflow-y-auto no-scrollbar" >
                        {/*headers */}
                        <div>
                            <div className="font-bold   border-black border-b-2 inline-block mb-2 w-full" >
                                <button className="font-bold w-3" onClick={() => this.setState(prevState => ({ showHeaderlist: !prevState.showHeaderlist }))}>
                                    {this.state.showHeaderlist ? '-' : '+'}
                                </button>
                                <div className="inline">Headers</div>
                            </div>
                            {
                                this.state.showHeaderlist && (
                                    <div className="ml-4 flex flex-wrap declareVariable">
                                        {this.state.headers.map((h, i) => {
                                            const data = { id: this.state.id, type: h, inside: [], indicator: false, elementType: "header" }
                                            return (<button draggable="true"
                                                className="bg-sky-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                                onDragStart={() => {
                                                    this.handleonDragStart(data, 1)
                                                }}>{h}</button>)
                                        })}

                                    </div>
                                )
                            }
                        </div>
                        {/*Define section*/}
                        <div>
                            <div className="font-bold   border-black border-b-2 inline-block mb-2 w-full" >
                                <button className="font-bold w-3" onClick={() => this.setState(prevState => ({ showDefineSection: !prevState.showDefineSection }))}>
                                    {this.state.showDefineSection ? '-' : '+'}
                                </button>
                                <div className="inline">Define</div>
                            </div>
                            {
                                this.state.showDefineSection && (
                                    <div className="ml-4 flex flex-wrap declareVariable">
                                        <button draggable="true"
                                            className="bg-cyan-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                            onDragStart={
                                                () => {
                                                    const data = { id: this.state.id, refId: null, type: "def" + this.state.id, value: null, inside: [], indicator: false, elementType: "defineBtn" }
                                                    this.handleonDragStart(data, 1)
                                                }}
                                        >
                                            define
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                        {/*variables */}
                        <div>
                            <div className="font-bold   border-black border-b-2 inline-block mb-2 w-full" >
                                <button className="font-bold w-3" onClick={() => this.setState(prevState => ({ showDeclareVariable: !prevState.showDeclareVariable }))}>
                                    {this.state.showDeclareVariable ? '-' : '+'}
                                </button>
                                <div className="inline">Variable declaration</div>
                            </div>
                            {
                                this.state.showDeclareVariable && (
                                    <div >
                                        <div className="ml-4 flex declareVariable">
                                            <button draggable="true"
                                                className="bg-blue-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                                onDragStart={(e) => {
                                                    e.stopPropagation()
                                                    const data = { id: this.state.id, dataType: "int", type: 'var' + this.state.id, value: null, inside: [{}], indicator: false, elementType: "variableBtn" }
                                                    this.handleonDragStart(data, 2)
                                                }}>int</button>
                                            <button draggable="true"
                                                className="bg-blue-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                                onDragStart={() => {
                                                    const data = { id: this.state.id, dataType: "int", type: 'var' + this.state.id, value: [], inside: [{}, {}], indicator: false, elementType: "variableBtn" }
                                                    this.handleonDragStart(data, 1)
                                                }}>int[]</button>
                                            <button draggable="true"
                                                className="bg-blue-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                                onDragStart={() => {
                                                    const data = { id: this.state.id, dataType: "int", type: 'var' + this.state.id, value: [], inside: [{}, {}, {}], indicator: false, elementType: "variableBtn" }
                                                    this.handleonDragStart(data, 1)
                                                }}>int[][]</button>
                                        </div>
                                        <div className="ml-4 flex declareVariable">
                                            <button draggable="true"
                                                className="bg-purple-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                                onDragStart={() => {
                                                    const data = { id: this.state.id, dataType: "float", type: 'var' + this.state.id, value: null, inside: [{}], indicator: false, elementType: "variableBtn" }
                                                    this.handleonDragStart(data, 1)
                                                }}>float</button>
                                            <button draggable="true"
                                                className="bg-purple-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                                onDragStart={() => {
                                                    const data = { id: this.state.id, dataType: "float", type: 'var' + this.state.id, value: [], inside: [{}, {}], indicator: false, elementType: "variableBtn" }
                                                    this.handleonDragStart(data, 1)
                                                }}>float[]</button>
                                            <button draggable="true"
                                                className="bg-purple-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                                onDragStart={() => {
                                                    const data = { id: this.state.id, dataType: "float", type: 'var' + this.state.id, value: [], inside: [{}, {}, {}], indicator: false, elementType: "variableBtn" }
                                                    this.handleonDragStart(data, 1)
                                                }}>float[][]</button>
                                        </div>
                                        <div className="ml-4 flex declareVariable">
                                            <button draggable="true"
                                                className="bg-green-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                                onDragStart={() => {
                                                    const data = { id: this.state.id, dataType: "char", type: 'var' + this.state.id, value: null, inside: [{}], indicator: false, elementType: "variableBtn" }
                                                    this.handleonDragStart(data, 1)
                                                }}>char</button>
                                            <button draggable="true"
                                                className="bg-green-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                                onDragStart={() => {
                                                    const data = { id: this.state.id, dataType: "char", type: 'var' + this.state.id, value: [], inside: [{}, {}], indicator: false, elementType: "variableBtn" }
                                                    this.handleonDragStart(data, 1)
                                                }}>char[]</button>
                                            <button draggable="true"
                                                className="bg-green-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                                onDragStart={() => {
                                                    const data = { id: this.state.id, dataType: "char", type: 'var' + this.state.id, value: [], inside: [{}, {}, {}], indicator: false, elementType: "variableBtn" }
                                                    this.handleonDragStart(data, 1)
                                                }}>char[][]</button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        {/*constant */}
                        <div>
                            <div className="font-bold   border-black border-b-2 inline-block mb-2 w-full" >
                                <button className="font-bold w-3" onClick={() => this.setState(prevState => ({ showInputFields: !prevState.showInputFields }))}>
                                    {this.state.showInputFields ? '-' : '+'}
                                </button>
                                <div className="inline">Input Fields</div>
                            </div>
                            {
                                this.state.showInputFields && (
                                    <div className="ml-4 flex flex-wrap declareVariable">
                                        <button draggable="true"
                                            className="bg-blue-300 p-1 rounded-md border-2 border-slate-600 mx-2px"
                                            onDragStart={() => {
                                                const data = { id: this.state.id, refId: null, dataType: "int", type: "intInput", value: 0, inside: [], indicator: false, elementType: "inputField" }
                                                this.handleonDragStart(data, 1)
                                            }}>input</button>
                                    </div>
                                )
                            }

                        </div>
                        {/*Conditionals */}
                        <div>
                            <div className="font-bold   border-black border-b-2 inline-block mb-2 w-full">
                                <button className="font-bold w-3" onClick={() => this.setState(prevState => ({ showConditionals: !prevState.showConditionals }))}>
                                    {this.state.showConditionals ? '-' : '+'}
                                </button>
                                <div className="inline">Conditional statements</div>
                            </div>
                            {
                                this.state.showConditionals && (
                                    <div className="ml-4 flex flex-wrap declareVariable">
                                        <button draggable="true"
                                            className="bg-lime-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                            onDragStart={() => {
                                                const data = { id: this.state.id, type: "cif", showOptions: false, inside: [condition(this.state.id + 1)], indicator: false, elementType: "conditional" }
                                                this.handleonDragStart(data, 4)
                                            }}>if</button>
                                        <button draggable="true"
                                            className="bg-lime-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                            onDragStart={() => {
                                                const data = { id: this.state.id, type: "celse", showOptions: false, inside: [], indicator: false, elementType: "conditional" }
                                                this.handleonDragStart(data, 1)
                                            }}>else</button>
                                    </div>
                                )
                            }
                        </div>
                        {/*Loops */}
                        <div>
                            <div className="font-bold   border-black border-b-2 inline-block mb-2 w-full">
                                <button className="font-bold w-3" onClick={() => this.setState(prevState => ({ showLoops: !prevState.showLoops }))}>
                                    {this.state.showLoops ? '-' : '+'}
                                </button>
                                <div className="inline">Loops</div>
                            </div>
                            {
                                this.state.showLoops && (
                                    <div className="ml-4 flex flex-wrap declareVariable">
                                        <button draggable="true"
                                            className="bg-orange-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                            onDragStart={() => {
                                                const data = { id: this.state.id, type: "cfor", inside: [assign(this.state.id + 1), condition(this.state.id + 2), assign(this.state.id + 3)], indicator: false, elementType: "loop" }
                                                this.handleonDragStart(data, 6)
                                            }}>For</button>

                                        <button draggable="true"
                                            className="bg-orange-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                            onDragStart={() => {
                                                const data = { id: this.state.id, type: "cwhile", inside: [condition(this.state.id + 1)], indicator: false, elementType: "loop" }
                                                this.handleonDragStart(data, 4)
                                            }}>While</button>

                                        <button draggable="true"
                                            className="bg-orange-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                            onDragStart={() => {
                                                const data = { id: this.state.id, type: "cdoWhile", inside: [condition(this.state.id + 1)], indicator: false, elementType: "loop" }
                                                this.handleonDragStart(data, 4)
                                            }}>Do-While</button>
                                    </div>
                                )
                            }
                        </div>
                        {/*Expressions */}
                        <div>
                            <div className="font-bold   border-black border-b-2 inline-block mb-2 w-full">
                                <button className="font-bold w-3" onClick={() => this.setState(prevState => ({ showOthers: !prevState.showOthers }))}>
                                    {this.state.showOthers ? '-' : '+'}
                                </button>
                                <div className="inline">Expressions</div>
                            </div>
                            {
                                this.state.showOthers && (
                                    <div className="ml-4 flex flex-wrap declareVariable">
                                        <button draggable="true"
                                            className="bg-rose-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                            onDragStart={() => {
                                                const data = { id: this.state.id, type: "assignment", sign: "=", inside: [{}, {}], indicator: false, elementType: "expression" }
                                                this.handleonDragStart(data, 1)
                                            }}>Assignment</button>
                                        <button draggable="true"
                                            className="bg-rose-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                            onDragStart={() => {
                                                const data = { id: this.state.id, type: "arithmatic", sign: "+", inside: [{}, {}], indicator: false, elementType: "expression" }
                                                this.handleonDragStart(data, 1)
                                            }}>Arithmatic</button>
                                        <button draggable="true"
                                            className="bg-rose-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                            onDragStart={() => {
                                                const data = { id: this.state.id, type: "return", sign: "+", inside: [{}], indicator: false, elementType: "expression" }
                                                this.handleonDragStart(data, 1)
                                            }}>return</button>
                                    </div>
                                )
                            }
                        </div>


                        {/*Functions */}
                        <div>
                            <div className="font-bold   border-black border-b-2 inline-block mb-2 w-full">
                                <button className="font-bold w-3" onClick={() => this.setState(prevState => ({ showFunctions: !prevState.showFunctions }))}>
                                    {this.state.showFunctions ? '-' : '+'}
                                </button>
                                <div className="inline">Functions</div>
                            </div>

                            {
                                this.state.showFunctions && (
                                    <div className="ml-4 flex flex-wrap declareVariable ">
                                        <button
                                            draggable="true"
                                            className="bg-yellow-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                            onDragStart={() => {
                                                const data = {
                                                    id: this.state.id,
                                                    type: 1 + "func" + this.state.id,
                                                    returnType: "void",
                                                    elementType: "functionBtn",
                                                    defination: true,
                                                    NumberOfParams: 0,
                                                    inside: [

                                                    ]
                                                }
                                                this.handleonDragStart(data, 1)
                                            }}
                                        >
                                            void
                                        </button>

                                        <button
                                            draggable="true"
                                            className="bg-yellow-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                            onDragStart={() => {
                                                const data = {
                                                    id: this.state.id,
                                                    type: 1 + "func" + this.state.id,
                                                    returnType: "int",
                                                    elementType: "functionBtn",
                                                    defination: true,
                                                    NumberOfParams: 0,
                                                    inside: [

                                                    ]
                                                }
                                                this.handleonDragStart(data, 1)
                                            }}
                                        >
                                            int
                                        </button>

                                        <button
                                            draggable="true"
                                            className="bg-yellow-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                            onDragStart={() => {
                                                const data = {
                                                    id: this.state.id,
                                                    type: 1 + "func" + this.state.id,
                                                    returnType: "float",
                                                    elementType: "functionBtn",
                                                    defination: true,
                                                    NumberOfParams: 0,
                                                    inside: [

                                                    ]
                                                }
                                                this.handleonDragStart(data, 1)
                                            }}
                                        >
                                            float
                                        </button>

                                        <button
                                            draggable="true"
                                            className="bg-yellow-300 p-1 rounded-md border-2 border-slate-600 m-2px"
                                            onDragStart={() => {
                                                const data = {
                                                    id: this.state.id,
                                                    type: 1 + "func" + this.state.id,
                                                    returnType: "char",
                                                    elementType: "functionBtn",
                                                    defination: true,
                                                    NumberOfParams: 0,
                                                    inside: [

                                                    ]
                                                }
                                                this.handleonDragStart(data, 1)
                                            }}
                                        >
                                            char
                                        </button>

                                        {this.state.functions.inside.map((f, i) => (
                                            f.name === " " ? null : (
                                                <button
                                                    id={f.type}
                                                    draggable="true"
                                                    className="bg-yellow-300 p-1 rounded-md border-2 flex border-slate-600 m-2px"
                                                    onDragStart={() => {
                                                        const tmp = []
                                                        for (let i = 0; i < f.inside.length; i++) {
                                                            const param = {
                                                                id: this.state.id + i,
                                                                dataType: f.inside[i].dataType,
                                                                type: null,
                                                                value: null,
                                                                inside: [{}],
                                                                indicator: false,
                                                                elementType: "param"
                                                            }

                                                            tmp.push(param)
                                                        }
                                                        const data = {
                                                            id: this.state.id + f.inside.length,
                                                            refId: f.id,
                                                            type: f.type,
                                                            elementType: "function",
                                                            returnType: f.returnType,
                                                            defination: false,
                                                            NumberOfParams: f.NumberOfParams,
                                                            inside: tmp
                                                        }


                                                        this.handleonDragStart(data, f.inside.length + 1)
                                                    }}

                                                >
                                                    {f.returnType} {f.type.slice(1)} ({f.inside.map((p, i) => {
                                                        if (i < f.NumberOfParams) {
                                                            return (
                                                                (i === 0) ? (
                                                                    <span id={i}>{p.dataType}</span>
                                                                ) :
                                                                    (
                                                                        <span id={i}>, {p.dataType}</span>
                                                                    )
                                                            )
                                                        }
                                                        else {
                                                            return null
                                                        }
                                                    })})
                                                </button>)
                                        ))}
                                    </div>
                                )
                            }
                        </div>

                    </div>
                )}

                <div className="space-y-4 p-10 m-10 mt-0 mb-0 bg-slate-200 w-3/4 h-screen overflow-y-auto no-scrollbar">
                    <p className="font-bold text-2xl border-b-2">Main.c</p>

                    <div className="bg-slate-300 p-4 rounded-lg">
                        <p className="text-right">Documentation section</p>
                        <pre className="bg-white p-2 rounded-md">
                            <code>
                                <div
                                    className="bg-blue-200 px-2 rounded-lg  border-gray-400 border-l-2">
                                    <p>{`/*`}</p>
                                    <ReactTextareaAutosize className="bg-slate-200 w-full" />
                                    <p>{`*/`}</p>
                                </div>

                            </code>
                        </pre>
                    </div>

                    <div className="bg-blue-100 p-4 rounded-lg">
                        <p className="text-right">Link section</p>
                        <pre className="bg-white p-2 rounded-md">
                            <code>
                                {showHeaders()}
                            </code>
                        </pre>
                    </div>


                    <div className="bg-amber-100 p-4 rounded-lg">
                        <p className="text-right">Definition section</p>
                        <pre className="bg-white p-2 rounded-md">
                            <code>
                                {showDefines()}
                            </code>
                        </pre>
                    </div>


                    <div className="bg-lime-100 p-4 rounded-lg">
                        <p className="text-right">Function declaration section</p>
                        <pre className="bg-white p-2 rounded-md">
                            <code>
                                {this.state.functions.inside.map((f, i) => (
                                    i === 0 || !f.defination ? null :
                                        f.name === " " ? null
                                            :
                                            (<div className="bg-blue-200 pl-2 rounded-lg my-1  border-gray-400 border-l-2">
                                                {f.returnType} {f.type.slice(1)} ({f.inside.map((p, i) => {
                                                    if (i < f.NumberOfParams) {
                                                        return (
                                                            (i === 0) ? (
                                                                <span id={i}>{p.dataType}</span>
                                                            ) :
                                                                (
                                                                    <span id={i}>, {p.dataType}</span>
                                                                ))
                                                    }
                                                    else {
                                                        return null
                                                    }

                                                })});
                                            </div>)
                                ))}
                            </code>
                        </pre>
                    </div>




                    <div className="bg-green-100 p-4 rounded-lg">
                        <p className="text-right">Global variable section</p>
                        <pre className="bg-white p-2 rounded-md">
                            <code>
                                {showGVariables()}
                            </code>
                        </pre>
                    </div>



                    <div className="bg-green-200 p-4 rounded-lg">
                        <p className="text-right">Main section</p>
                        <pre className="bg-white p-2 rounded-md">
                            <code>
                                <p id={this.state.functions.inside[0].id}>{subP(this.state.functions.inside[0].id)}</p>
                            </code>
                        </pre>
                    </div>


                    <div className="bg-purple-100 p-4 rounded-lg">
                        <p className="text-right">Subprogram section</p>

                        <pre className="bg-white p-2 rounded-md">
                            <code>
                                {showSubprograms()}
                            </code>
                        </pre>
                    </div>





                    <div className="flex justify-center">
                        <button className="align-middle m-5 border-2 w-24 h-12 bg-lime-200" onClick={handleRunButtonClick}>
                            {this.state.showOutput ? "Stop" : "Run"}
                        </button>
                        {/* Display response data */}

                    </div>

                    {(() => {
                        const divRef = React.createRef();

                        const handleDragEnter = debounce(() => {
                            if (divRef.current) {
                                divRef.current.style.backgroundColor = "red";
                            }
                        }, 100);

                        const handleDragLeave = debounce(() => {
                            if (divRef.current) {
                                divRef.current.style.backgroundColor = "white";
                            }
                        }, 100);

                        return (
                            <div>
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    ref={divRef}
                                    size="2x"
                                    className={`fixed bottom-8 right-8 p-3 rounded-full bg-white`}
                                    onDrop={(e) => {
                                        this.deleteItem();
                                        if (divRef.current) {
                                            divRef.current.style.backgroundColor = "white";
                                        }
                                    }}
                                    onDragEnter={(e) => {
                                        e.preventDefault();
                                        handleDragEnter();
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        handleDragLeave();
                                    }}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        if (divRef.current) {
                                            divRef.current.style.backgroundColor = "red";
                                        }
                                    }}
                                />
                            </div>
                        );
                    })()}




                </div>
                {this.state.showOutput && (
                    <div className="flex flex-col h-screen w-1/2 flex-grow text-white">
                        <p>Code:</p>
                        <div className="h-3/6 w-full bg-cyan-50  p-4 rounded-md font-mono text-black mb-4">

                            <pre className="bg-slate-200 p-1 h-full rounded-md overflow-y-scroll">{this.state.code}</pre>

                        </div>
                        <p>Console:</p>
                        <div className="h-2/6 w-full bg-slate-800 overflow-y-scroll text-slate-50 p-4 border-4 rounded-md font-mono">
                            {this.state.responseData}
                        </div>
                    </div>
                )}


                {/*          
                <div id="memory" className="space-y-4 p-10 pb-20  m-10 mt-0 mb-0 bg-slate-200 w-1/2 h-screen">
                    <p className="font-bold text-2xl border-b-2">Memory</p>
                    <div className="flex h-full">
                        <div className="w-1/2 mx-5 mb-10 p-2 h-full bg-cyan-200 rounded-md">
                            <p className="font-bold text-lg align-middle">data</p>
                            <div className="overflow-y-auto  max-h-[calc(100%-2rem-2.5rem)] no-scrollbar">
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <label>s</label>
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>

                            </div>
                        </div>

                        <div className="w-1 bg-slate-500"></div>

                        <div className="w-1/2 mx-5 mb-10 p-2 h-full bg-blue-300 rounded-md">
                            <p className="font-bold text-lg align-middle">stack</p>
                            <div id="stack" className="overflow-y-auto max-h-[calc(100%-2rem-2.5rem)] no-scrollbar">
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>
                                <div className="flex justify-end">
                                    <input className="border-2 w-3/5 ml-2 px-1 bg-white bg-opacity-40 border-slate-500"></input>
                                </div>



                            </div>
                        </div>
                    </div>
                </div>*/}



            </div>
        );
    }
}

export default Code;
