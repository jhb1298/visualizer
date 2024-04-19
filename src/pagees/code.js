//import { type } from "@testing-library/user-event/dist/type";
import React from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
const cloneDeep = require('lodash/cloneDeep');

class Code extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            id: 10,




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
            defines: [],
            gVariables: [],

            functions: {
                inside: [
                    {
                        showParamTypes: false,
                        showOptions: false,
                        id: 0,
                        type: "1main",
                        returnType: "int",
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
                        NumberOfParams: 1,
                        inside: [
                            { id: 3, dataType: "char[]", type: 'var' + 3, value: null, inside: [{}], indicator: false, elementType: "param" }
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
                            { id: 4, dataType: "char[]", type: 'var' + 4, value: null, inside: [{}], indicator: false, elementType: "param" },
                            { id: 5, dataType: "any", type: 'var' + 5, value: null, inside: [{}], indicator: false, elementType: "param" }
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

    findObjectWithID = (id, indexF) => {
        let object = null
        this.state.gVariables.forEach((element) => {
            if (element.id === id) {
                object = cloneDeep(element)
                return object
            }
        })
        const findObj = (obj) => {
            if (obj.hasOwnProperty("inside")) {
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

        if (indexF) {
            findObj(this.state.functions.inside[indexF])
        }
        else {
            findObj(this.state.functions)
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

                const update = (updated) => {
                    if (x < indices.length) {
                        x++;
                        parent = updated.inside
                        update(updated.inside[indices[x - 1]]);
                    } else {

                        if (empty) {
                            updated.inside.splice(updated.inside.length, 0, data)
                            return
                        }
                        if (position === "top") {
                            parent.splice(indices[x - 1], 0, data);
                        } else {
                            parent.splice(indices[x - 1] + 1, 0, data);
                        }

                    }
                };
                update(updatedFunc);

                return { functions: updatedFunc };
            }, () => {
                console.log("Value after insertion:", this.state.functions.inside);
            });
        }
    };


    //----------------------------------------
    handleonDragStart = (data, inc) => {
        this.setState({ value: data, inc: inc })
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
                return { gVariables: [...prevState.gVariables, data] }
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
                const g = [...prevState.gVariables]
                g.splice(index + position, 0, data)
                return { gVariables: g }
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
                return { defines: [...prevState.defines, data] }
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
                const g = [...prevState.defines]
                g.splice(index + position, 0, data)
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

        let data = {
            showParamTypes: false,
            showOptions: false,
            id: this.state.id,
            type: "1func" + this.state.id,
            returnType: "void",
            defination: true,
            NumberOfParams: 0,
            inside: [


            ]
        }
        this.setState((prevState) => {
            return { id: prevState.id + 1 }
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
        this.insertItem(obj, indexF, data, position, empty)
        this.setState((prevState) => {
            const funcs = cloneDeep(prevState.functions)
            funcs.inside[indexF].NumberOfParams += 1
            return { functions: funcs }
        })

    }

    dropOnSlot = (e, obj, data, divRef, index) => {
        e.stopPropagation()
        const indices = this.findIndices(obj)


        this.setState(prevState => {
            const updatedFunc = cloneDeep(prevState.functions);
            let x = 0;


            const update = (updated) => {
                if (x < indices.length) {
                    x++;
                    update(updated.inside[indices[x - 1]]);
                } else {
                    updated.inside[index] = data
                }
            };
            update(updatedFunc);


            return { functions: updatedFunc };
        }, () => {
            console.log("Value:", this.state.functions.inside);
        });

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

    updateVariablesValue = (obj, indexF, e) => {

        let indices = this.findIndices(obj, indexF);
        this.setState(prevState => {
            const updatedFunc = cloneDeep(prevState.functions);
            let x = 0;

            const update = (updated) => {
                if (x < indices.length) {
                    x++;
                    update(updated.inside[indices[x - 1]]);
                } else {
                    updated.value = e.target.value
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
            defs[index].type = e.target.value
            return { defines: defs }
        })
    }

    updateDefinesValue = (e, index) => {
        this.setState((prevState) => {
            const defs = cloneDeep(prevState.defines)
            defs[index].value = e.target.value
            return { defines: defs }
        })
    }

    updateGVariablesName = (e, index) => {
        this.setState((prevState) => {
            const gVars = cloneDeep(prevState.gVariables)
            gVars[index].type = e.target.value
            return { gVariables: gVars }
        })
    }

    updateGVariablesValue = (e, index) => {
        this.setState((prevState) => {
            const gVars = cloneDeep(prevState.gVariables)
            gVars[index].value = e.target.value
            return { gVariables: gVars }
        })
    }


    render() {


        const showArray = (obj) => {
            let items = []
            items.push("{")
            for (let i = 0; i < obj.inside[0].value; i++) {
                if (i !== 0) {
                    items.push(",")
                }
                if (obj.inside.length === 2) {
                    items.push("{")
                    for (let j = 0; j < obj.inside[1].value; j++) {
                        if (j !== 0) {
                            items.push(",")
                        }
                        items.push(<input
                            className="w-4 rounded-md"
                        />)
                    }
                    items.push("}")
                }
                else {
                    items.push(<input
                        className="w-4 rounded-md"
                    />)
                }
            }
            items.push("}")
            return items;

        }


        const variable = (obj, index, gVariables) => {
            return (<div className="flex">
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
                    onDragStart={() => {
                        const data = { id: this.state.id, refId: obj.id, dataType: obj.dataType, type: obj.type, value: obj.value, inside: obj.inside, indicator: false, elementType: "variable" }
                        this.handleonDragStart(data, 1)
                    }}
                />

                {obj.inside.map((l, i) => {
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
                                            className="w-5 bg-slate-200 autoAdjust"
                                            onChange={(e) => {
                                                this.adjustInputWidth()
                                                this.updateVariablesValue(obj.inside[i], index, e)
                                            }}
                                        />)
                                    case ("floatInput"): return (<input />)
                                    case ("charInput"): return (<input />)
                                    default: return obj.inside[i].hasOwnProperty("refId") ?
                                        this.findObjectWithID(obj.inside[i].refId, index).type
                                        : <p>{"   "}</p>
                                }
                            })()
                        }

                    </div>
                })}

                =
                {obj.inside.length === 0 ?
                    <input
                        onChange={(e) => {
                            /*this.intValue(e);
                            this.floatValue(e);
                            this.charValue(e);*/
                            this.adjustInputWidth(e);
                            if (gVariables) {
                                this.updateGVariablesValue(e, index)
                            }
                            else {
                                this.updateVariablesValue(obj, index, e)
                            }
                        }}
                        value={obj.value}

                        className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                    />
                    :
                    showArray(obj)
                }

                ;
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
                                    this.handleOnDragOver(e, divRef)
                                }}
                                onDrop={(e) => {
                                    this.handleOnDrop(e, im, indexF, divRef)
                                }}
                                onDragLeave={(e) => {
                                    this.handleOnDragLeave(e, divRef)
                                }}>{assignment(im, indexF)}</div>;
                        case "cif":
                            return <div
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
                                }}>{cif(im, indexF)}</div>;
                        case "celse":
                            return <div
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
                                }}>{celse(im, indexF)}</div>;
                        case "cfor":
                            return <div
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
                            >
                                {cfor(im, indexF)}
                            </div>

                        case "cwhile":
                            return <div
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
                            >
                                {cwhile(im, indexF)}
                            </div>;

                        case "cdoWhile":
                            return <div
                                ref={divRef}
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
                            >
                                {cdoWhile(im, indexF)}
                            </div>
                        default:
                            if (im.type[0] === '1') {


                                return (
                                    <div
                                        id={i}
                                        ref={divRef}
                                        className={`pl-2 rounded-lg my-1 border-gray-400 border-l-2  ${colorList[depth - 2]} sortable`}
                                        onDragOver={(e) => {
                                            this.handleOnDragOver(e, divRef)
                                        }}
                                        onDrop={(e) => {
                                            this.handleOnDrop(e, im, indexF, divRef)
                                        }}
                                        onDragLeave={(e) => {
                                            this.handleOnDragLeave(e, divRef)
                                        }}>
                                        {funcCall(im, indexF)}
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
                                    }}>{variable(im, indexF, false)}</div>;
                            }
                    }
                }
                else {
                    return null
                }
            })
        }

        /*
        const func = (func, indexF) => {
            if (!func) {
                return null;
            }

            return (
                <div className=" min-h-11 pt-2 flex">
                    {func.type.slice(1)}(
                    <div className="min-w-4">
                        {console.log("Funcccc:", func)}
                        {func.inside.map((p, i) => {
                            if (i < func.NumberOfParams) {
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
                                                type: this.state.value.value,
                                                value: this.state.value.val ?? null
                                            }
                                            this.setState((prevState) => {
                                                return { id: prevState.id + 1 }
                                            })
                                            this.dropOnSlot(e, p, data, divRef, 0)
                                        }}
                                    >
                                        <p>{"sdfsdfdf"}</p>
                                        {
                                            (() => {
                                                switch (p.inside[0].type) {
                                                    case ("intInput"): return (
                                                        <input
                                                            className="w-5 bg-slate-200 autoAdjust"
                                                            onChange={(e) => { this.adjustInputWidth() }}
                                                        />)
                                                    case ("floatInput"): return (<input />)
                                                    case ("charInput"): return (<input />)
                                                    case ("arithmatic"): return (arithmatic(p.inside[0]))
                                                    default: return p.inside[0].hasOwnProperty("refId") ?
                                                        this.findObjectWithID(p.inside[0].refId, indexF).type
                                                        : <p>{"   "}</p>
                                                }
                                            })()
                                        }
                                    </div>
                                </div>)
                            }
                            else {
                                return null
                            }

                        })}
                    </div>
                    );
                </div>
            );
        };
*/
        const funcCall = (func, indexF) => {
            if (!func) {
                return null;
            }

            return (
                <div className=" min-h-10 py-2 flex">
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
                                                    this.dropOnSlot(e, p, data, divRef, 0)
                                                }}
                                            >

                                                {
                                                    (() => {
                                                        switch (p.inside[0].type) {
                                                            case ("intInput"): return (
                                                                <input
                                                                    className="w-5 bg-slate-200 autoAdjust"
                                                                    onChange={(e) => { this.adjustInputWidth() }}
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
                    this.handleOnDragOver(e, divRef)
                }}
                onDrop={(e) => {
                    this.dropOnGVariables(e, null, divRef, true) //empty=true as empty section
                }}
                onDragLeave={(e) => {
                    this.handleOnDragLeave(e, divRef)
                }}>
                {this.state.gVariables.map((v, i) => {
                    const divRef = React.createRef();
                    return (<div
                        className="bg-blue-200 pl-2 rounded-lg my-1  border-gray-400 border-l-2 sortable"
                        ref={divRef}
                        onDragOver={(e) => {
                            this.handleOnDragOver(e, divRef)
                        }}
                        onDrop={(e) => {
                            this.dropOnGVariables(e, i, divRef, false) //empty=false as non empty section
                        }}
                        onDragLeave={(e) => {
                            this.handleOnDragLeave(e, divRef)
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
                    this.handleOnDragOver(e, divRef)
                }}
                onDrop={(e) => {
                    this.dropOnHeaders(e, null, divRef, true) //empty=true as empty section
                }}
                onDragLeave={(e) => {
                    this.handleOnDragLeave(e, divRef)
                }}>
                {this.state.cheaders.map((h, i) => {
                    const divRef = React.createRef();
                    return (<div
                        className="bg-blue-200 pl-2 rounded-lg my-1 min-h-10  border-gray-400 border-l-2 sortable"
                        ref={divRef}
                        onDragOver={(e) => {
                            this.handleOnDragOver(e, divRef)
                        }}
                        onDrop={(e) => {
                            this.dropOnHeaders(e, i, divRef, false) //empty=false as non empty section
                        }}
                        onDragLeave={(e) => {
                            this.handleOnDragLeave(e, divRef)
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
                    this.handleOnDragOver(e, divRef)
                }}
                onDrop={(e) => {
                    this.dropOnDefine(e, null, divRef, true) //empty=true as empty section
                }}
                onDragLeave={(e) => {
                    this.handleOnDragLeave(e, divRef)
                }}>
                {this.state.defines.map((d, i) => {
                    const divRef = React.createRef();

                    return (
                        <div
                            className="bg-blue-200 pl-2 rounded-lg my-1  border-gray-400 border-l-2 sortable"
                            ref={divRef}
                            onDragOver={(e) => {
                                this.handleOnDragOver(e, divRef)
                            }}
                            onDrop={(e) => {
                                this.dropOnDefine(e, i, divRef, false) //empty=false as non empty section
                            }}
                            onDragLeave={(e) => {
                                this.handleOnDragLeave(e, divRef)
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
                        this.handleOnDragOver(e, divRef)
                    }}
                    onDrop={(e) => {
                        this.dropOnSubP(e, null, divRef, true) //empty=true as empty section
                    }}
                    onDragLeave={(e) => {
                        this.handleOnDragLeave(e, divRef)
                    }}>
                    {this.state.functions.inside.map((f, index) => {
                        const divRef = React.createRef()
                        return (
                            index === 0 || !f.defination ? null :
                                <div
                                    id={f.id}
                                    className="bg-blue-200 rounded-lg my-1  border-gray-400 border-l-2 sortable"
                                    ref={divRef}
                                    onDragOver={(e) => {
                                        this.handleOnDragOver(e, divRef)
                                    }}
                                    onDrop={(e) => {
                                        this.dropOnSubP(e, index, divRef, false) //empty=false as non empty section
                                    }}
                                    onDragLeave={(e) => {
                                        this.handleOnDragLeave(e, divRef)
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
                                className="bg-blue-200 rounded-lg  min-w-4  sortable"
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
                        <div className="bg-slate-200 ml-4 mr-0 min-h-4"
                            ref={divRef}
                            onDragOver={(e) => {
                                this.handleOnDragOver(e, divRef)
                            }}
                            onDrop={(e) => {
                                this.handleOnDrop(e, obj, index, divRef, true)
                            }}
                            onDragLeave={(e) => {
                                this.handleOnDragLeave(e, divRef)
                            }}
                        >

                            {
                                showInside(obj, index, obj.NumberOfParams)    //show the elements inside subP
                            }
                        </div>
                        <p>{"}"}</p>
                    </code>
                </div>
            );
        };


        const conditional = (obj, indexF) => {
            console.log("objecthgoottt:", obj)
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
                        this.dropOnSlot(e, obj, data, divRef, 0)
                    }}
                >

                    {
                        (() => {
                            switch (obj.inside[0].type) {
                                case ("intInput"): return (
                                    <input
                                        className="w-5 bg-slate-200 autoAdjust"
                                        onChange={(e) => { this.adjustInputWidth() }}
                                    />)
                                case ("floatInput"): return (<input />)
                                case ("charInput"): return (<input />)
                                case ("arithmatic"): return (arithmatic(obj.inside[0]))
                                default: return obj.inside[0].hasOwnProperty("refId") ? (
                                    () => {
                                        const tmp = []
                                        const elmnt = this.findObjectWithID(obj.inside[0].refId, indexF)
                                        tmp.push(elmnt.type)

                                        obj.inside[0].hasOwnProperty("inside") ?
                                            obj.inside[0].inside.map((l, i) => {
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
                                                                        onChange={(e) => { this.adjustInputWidth() }}
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
                                            }) : <p>{"   "}</p>

                                        return tmp
                                    }
                                )()
                                    : <p>{"   "}</p>
                            }
                        })()
                    }


                </div>
                <select className="appearance-none bg-slate-200">
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
                            switch (obj.inside[1].type) {
                                case ("intInput"): return (
                                    <input
                                        className="w-5 bg-slate-200 autoAdjust"
                                        onChange={(e) => { this.adjustInputWidth() }}
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
                                                                        onChange={(e) => { this.adjustInputWidth() }}
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
                                            this.updateVariablesValue(obj.inside[0], indexF, e)
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
                                                                                this.updateVariablesValue(obj.inside[0], indexF, e)
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
                                                }) : <p>{"   "}</p>

                                            return tmp
                                        }
                                    )()
                                        : <p>{"   "}</p>
                            }
                        })()
                    }

                </div>
                <select className="appearance-none bg-slate-200 px-1 ">
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
                                            this.updateVariablesValue(obj.inside[1], indexF, e)
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
                                                                            this.updateVariablesValue(obj.inside[1], indexF, e)
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
                    onDragOver={(e) => this.handleOnDragOver(e, divRef)}
                    onDragLeave={(e) => this.handleOnDragLeave(e, divRef)}
                    onDrop={(e) => {
                        const data = {
                            id: this.state.id,
                            refId: this.state.value.refId,
                            type: this.state.value.type,
                            inside: this.state.value.inside,
                            value: this.state.value.value
                        }
                        this.setState((prevState) => ({ id: prevState.id + 1 }))
                        this.dropOnSlot(e, obj, data, divRef, 0)
                    }}
                >

                    {obj.inside[0].refId !== null ?
                        this.findObjectWithID(obj.inside[0].refId, indexF).type
                        : null}

                    {
                        obj.inside[0].hasOwnProperty("inside") ?
                            obj.inside[0].inside.map((l, i) => {
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
                                                            this.updateVariablesValue(obj.inside[0].inside[i], indexF, e)
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
                            }) : <p>{"   "}</p>}

                </div>
                <select className="appearance-none bg-slate-200 px-1 ">
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
                                            this.updateVariablesValue(obj.inside[1], indexF, e)
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
                                                                            this.updateVariablesValue(obj.inside[1].inside[i], indexF, e)
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
                        })()
                    }
                    {/*
                        obj.inside[1].hasOwnProperty("inside") ?
                            obj.inside[1].inside.map((l, i) => {
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
                                        this.dropOnSlot(e, obj.inside[1], data, divRef, i)
                                    }}
                                >


                                    {

                                        (() => {
                                            switch (obj.inside[1].inside[i].type) {
                                                case ("intInput"): return (
                                                    <input
                                                        className="w-5 bg-slate-200 autoAdjust"
                                                        onChange={(e) => { this.adjustInputWidth() }}
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

                                </div>
                            }) : <p>{"   "}</p> */}


                    {/*

                        (() => {
                            console.log("Input asssigbn:", obj)
                            switch (obj.inside[1].type) {
                                case ("intInput"): return (
                                    <input
                                        className="w-5 bg-slate-200 autoAdjust"
                                        onChange={(e) => { this.adjustInputWidth() }}
                                    />)
                                case ("floatInput"): return (<input />)
                                case ("charInput"): return (<input />)
                                case ("arithmatic"): return (arithmatic(obj.inside[1]))
                                default: return obj.inside[1].hasOwnProperty("refId") ? (
                                    () => {
                                        const tmp = []
                                        const elmnt = this.findObjectWithID(obj.inside[1].refId, indexF)
                                        tmp.push(elmnt.type)
                                        elmnt.dimension.map((l, i) => {
                                            tmp.push(<input
                                                className="w-4 min-w-4  bg-slate-200 bg-opacity-50 rounded-md border-x-2 border-x-black autoAdjust"
                                                onChange={(e) => {
                                                    this.updateVariablesDimention(obj.inside[1], indexF, e, i)
                                                    this.adjustInputWidth(e);
                                                }}
                                            />)
                                            return null
                                        })

                                        return tmp
                                    }
                                )()
                                    : <p>{"   "}</p>
                            }
                        })()
                    */}

                </div>
                ;
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
                            this.handleOnDragOver(e, divRef)
                        }}
                        onDrop={(e) => {
                            this.handleOnDrop(e, obj, indexF, divRef, true)
                        }}
                        onDragLeave={(e) => {
                            this.handleOnDragLeave(e, divRef)
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
                            this.handleOnDragOver(e, divRef)
                        }}
                        onDrop={(e) => {
                            this.handleOnDrop(e, obj, indexF, divRef, true)
                        }}
                        onDragLeave={(e) => {
                            this.handleOnDragLeave(e, divRef)
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
                            this.handleOnDragOver(e, divRef)
                        }}
                        onDrop={(e) => {
                            this.handleOnDrop(e, obj, indexF, divRef, true)
                        }}
                        onDragLeave={(e) => {
                            this.handleOnDragLeave(e, divRef)
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
                            this.handleOnDragOver(e, divRef)
                        }}
                        onDrop={(e) => {
                            this.handleOnDrop(e, obj, indexF, divRef, true)
                        }}
                        onDragLeave={(e) => {
                            this.handleOnDragLeave(e, divRef)
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
                            this.handleOnDragOver(e, divRef)
                        }}
                        onDrop={(e) => {
                            this.handleOnDrop(e, obj, indexF, divRef, true)
                        }}
                        onDragLeave={(e) => {
                            this.handleOnDragLeave(e, divRef)
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
        const showVariables = () => {
            const vars = []
            const obj = cloneDeep(this.state.functions)
            const findVars = (obj) => {
                obj.inside.forEach((element) => {
                    if (element.elementType === "variable") {
                        vars.push(<button draggable="true" onDragStart={() => { this.handleonDragStart(element.type, element.value, element.id) }}>{element.dataType} {element.type}</button>)
                    }
                    else if (element.hasOwnProperty("inside")) {
                        if (element.inside.length < 1) {
                            return;
                        }
                        else {
                            findVars(element)
                        }
                    }
                })

            }

            findVars(obj)
            return vars
        }
        */
        /**********************************************************************************************************************************/

        const assign = (id) => { return { id: id, type: "assignment", sign: "=", inside: [{}, {}], indicator: false, elementType: "assignment" } }
        const condition = (id) => { return { id: id, type: "conditional", sign: "==", inside: [{}, {}], indicator: false, elementType: "conditional" } }

        return (
            <div className="bg-slate-700  flex">
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
                                        return (<button draggable="true" onDragStart={() => {
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
                                    <button draggable="true" onDragStart={
                                        () => {
                                            const data = { id: this.state.id, type: "def" + this.state.id, value: null, inside: [], indicator: false, elementType: "defineBtn" }
                                            this.handleonDragStart(data, 1)
                                        }}>define</button>
                                    {this.state.defines.map((d) =>
                                    (
                                        <button draggable="true" onDragStart={() => {
                                            const data = { id: this.state.id, type: d.type, value: d.value, inside: [], indicator: false, elementType: "define" }
                                            this.handleonDragStart(data, 1)
                                        }}>{d.type}</button>
                                    )
                                    )}
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
                                <div className="ml-4 flex flex-wrap  declareVariable">
                                    <button draggable="true"
                                    className="bg-blue-300 p-1 rounded-md border-2 border-slate-600 mx-2px"
                                    onDragStart={() => {
                                        const data = { id: this.state.id, dataType: "int", type: 'var' + this.state.id, dimension: [], value: null, inside: [], indicator: false, elementType: "variable" }
                                        this.handleonDragStart(data, 1)
                                    }}>int</button>
                                    <button draggable="true"
                                    className="bg-blue-300 p-1 rounded-md border-2 border-slate-600 mx-2px"
                                     onDragStart={() => {
                                        const data = { id: this.state.id, dataType: "int", type: 'var' + this.state.id, value: null, inside: [{}], indicator: false, elementType: "variable" }
                                        this.handleonDragStart(data, 1)
                                    }}>int</button>[]
                                    <button draggable="true" onDragStart={() => {
                                        const data = { id: this.state.id, dataType: "int", type: 'var' + this.state.id, value: null, inside: [{}, {}], indicator: false, elementType: "variable" }
                                        this.handleonDragStart(data, 1)
                                    }}>int[][]</button>


                                    <button draggable="true" onDragStart={() => {
                                        const data = { id: this.state.id, dataType: "float", type: 'var' + this.state.id, value: null, inside: [], indicator: false, elementType: "variable" }
                                        this.handleonDragStart(data, 1)
                                    }}>float</button>
                                    <button draggable="true" onDragStart={() => {
                                        const data = { id: this.state.id, dataType: "float", type: 'var' + this.state.id, value: null, inside: [{}], indicator: false, elementType: "variable" }
                                        this.handleonDragStart(data, 1)
                                    }}>float[]</button>
                                    <button draggable="true" onDragStart={() => {
                                        const data = { id: this.state.id, dataType: "float", type: 'var' + this.state.id, value: null, inside: [{}, {}], indicator: false, elementType: "variable" }
                                        this.handleonDragStart(data, 1)
                                    }}>float[][]</button>


                                    <button draggable="true" onDragStart={() => {
                                        const data = { id: this.state.id, dataType: "char", type: 'var' + this.state.id, value: null, inside: [], indicator: false, elementType: "variable" }
                                        this.handleonDragStart(data, 1)
                                    }}>char</button>
                                    <button draggable="true" onDragStart={() => {
                                        const data = { id: this.state.id, dataType: "char", type: 'var' + this.state.id, value: null, inside: [{}], indicator: false, elementType: "variable" }
                                        this.handleonDragStart(data, 1)
                                    }}>char[]</button>
                                    <button draggable="true" onDragStart={() => {
                                        const data = { id: this.state.id, dataType: "char", type: 'var' + this.state.id, value: null, inside: [{}, {}], indicator: false, elementType: "variable" }
                                        this.handleonDragStart(data, 1)
                                    }}>char[][]</button>

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
                                    <button draggable="true" onDragStart={() => {
                                        const data = { id: this.state.id, refId: null, dataType: "int", type: "intInput", value: null, inside: [], indicator: false, elementType: "inputField" }
                                        this.handleonDragStart(data, 1)
                                    }}>int</button>

                                    <button draggable="true" onDragStart={() => {
                                        const data = { id: this.state.id, refId: null, dataType: "float", type: "floatInput", value: null, inside: [], indicator: false, elementType: "inputField" }
                                        this.handleonDragStart(data, 1)
                                    }}>float</button>

                                    <button draggable="true" onDragStart={() => {
                                        const data = { id: this.state.id, refId: null, dataType: "char", type: "charInput", value: null, inside: [], indicator: false, elementType: "inputField" }
                                        this.handleonDragStart(data, 1)
                                    }}>char</button>
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
                                    <button draggable="true" onDragStart={() => {
                                        const data = { id: this.state.id, type: "cif", showOptions: false, inside: [condition(this.state.id + 1)], indicator: false, elementType: "conditional" }
                                        this.handleonDragStart(data, 2)
                                    }}>if</button>
                                    <button draggable="true" onDragStart={() => { this.handleonDragStart("celse") }}>else</button>
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
                                    <button draggable="true" onDragStart={() => {
                                        const data = { id: this.state.id, type: "cfor", inside: [assign(this.state.id + 1), condition(this.state.id + 2), assign(this.state.id + 3)], indicator: false, elementType: "loop" }
                                        this.handleonDragStart(data, 4)
                                    }}>For</button>

                                    <button draggable="true" onDragStart={() => {
                                        const data = { id: this.state.id, type: "cwhile", inside: [condition(this.state.id + 1)], indicator: false, elementType: "loop" }
                                        this.handleonDragStart(data, 2)
                                    }}>While</button>

                                    <button draggable="true" onDragStart={() => {
                                        const data = { id: this.state.id, type: "cdoWhile", inside: [condition(this.state.id + 1)], indicator: false, elementType: "loop" }
                                        this.handleonDragStart(data, 2)
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
                                    <button draggable="true" onDragStart={() => {
                                        const data = { id: this.state.id, type: "assignment", sign: "=", inside: [{}, {}], indicator: false, elementType: "expression" }
                                        this.handleonDragStart(data, 1)
                                    }}>Assignment</button>
                                    <button draggable="true" onDragStart={() => {
                                        const data = { id: this.state.id, type: "arithmatic", sign: "+", inside: [{}, {}], indicator: false, elementType: "expression" }
                                        this.handleonDragStart(data, 1)
                                    }}>Arithmatic</button>
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
                                        onDragStart={() => {
                                            const data = {
                                                id: this.state.id,
                                                type: "func" + this.state.id,
                                                returnType: "void",
                                                defination: false,
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
                                        onDragStart={() => {
                                            const data = {
                                                id: this.state.id,
                                                type: "func" + this.state.id,
                                                returnType: "int",
                                                defination: false,
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
                                        onDragStart={() => {
                                            const data = {
                                                id: this.state.id,
                                                type: "func" + this.state.id,
                                                returnType: "float",
                                                defination: false,
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
                                        onDragStart={() => {
                                            const data = {
                                                id: this.state.id,
                                                type: "func" + this.state.id,
                                                returnType: "char",
                                                defination: false,
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
                                                onDragStart={() => {
                                                    const data = {
                                                        id: this.state.id,
                                                        refId: f.id,
                                                        type: f.type,
                                                        returnType: f.returnType,
                                                        defination: false,
                                                        NumberOfParams: f.NumberOfParams,
                                                        inside: cloneDeep(f.inside)
                                                    }
                                                    this.handleonDragStart(data, 1)
                                                }}
                                                className="flex"
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
                                                                <span id={i}>{p.type}</span>
                                                            ) :
                                                                (
                                                                    <span id={i}>, {p.type}</span>
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
                        <button className="align-middle m-5 border-2 w-24 h-12 bg-lime-200">
                            Run
                        </button>
                    </div>
                </div>

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
