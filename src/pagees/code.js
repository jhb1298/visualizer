//import { type } from "@testing-library/user-event/dist/type";
import React from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
const cloneDeep = require('lodash/cloneDeep');

class Code extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            id: 2,

            divs: [],
            objs: [],
            sortableDivsRef: [],

            showDeclareVariable: false,
            showConditionals: false,
            showLoops: false,
            showFunctions: false,
            showOthers: false,


            value: "",

            showHeaderSelect: false,
            showDataTypes: false,
            showParamTypes: false,
            showFunctionTypes: false,
            selectedHeader: "",
            cheaders: ["stdio.h"],
            definations: [],
            gVariables: [],
            insideMain: [],

            functions: {
                inside: [
                    {
                        showParamTypes: false,
                        showOptions: false,
                        id: 0,
                        type: "main",
                        returnType: "int",
                        params: [

                        ],
                        inside: [


                        ]
                    },
                    {
                        showParamTypes: false,
                        showOptions: false,
                        id: 1,
                        type: "sum",
                        returnType: "int",
                        params: [
                            {
                                type: "int",
                                name: "a",
                                value: null
                            },
                            {
                                type: "float",
                                name: "b",
                                value: null
                            }
                        ],
                        inside: [


                        ]
                    },
                ]
            }

        };
    }


    toggleHeaderSelect = () => {
        this.setState((prevState) => ({
            showHeaderSelect: !prevState.showHeaderSelect,
        }));
    };

    headerSelect = (event) => {
        const selectedHeader = event.target.value;

        if (!this.state.cheaders.includes(selectedHeader)) {
            this.setState((prevState) => {
                const cheaders = [...prevState.cheaders, selectedHeader];
                return {
                    cheaders,
                    selectedHeader: "",
                    showHeaderSelect: false,
                };
            });
        }
    };

    dataTypeSelect = (event) => {
        /*const selectedDataType = event.target.value;*/
        this.setState((prevState) => ({
            gVariables: [...prevState.gVariables, event.target.value]
        }));
    };

    adjustInputWidth = () => {
        const inputs = document.getElementsByClassName('autoAdjust'); // Replace 'myInput' with the actual class of your input fields

        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            input.style.width = '20px'; // Reset width to 'auto' to get the natural width
            input.style.width = input.scrollWidth + 10 + 'px';
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

    createItem = (type, dataType) => {
        let data = {}
        switch (type) {
            case ("int"): data = { id: this.state.id, type: type, var: null, value: 0 }
                break;
            case ("float"): data = { id: this.state.id, type: type, var: null, value: 0.0 }
                break;
            case ("char"): data = { id: this.state.id, type: type, var: null, value: '' }
                break;
            case ("asign"): data = { id: this.state.id, type: type, showAssignmentOptions: true, value: "", inside: [] }
                break;
            case ("cif"): data = { id: this.state.id, type: type, showOptions: false, l: null, sign: "==", r: null, inside: [] }
                break;
            case ("celse"): data = { id: this.state.id, type: type, l: null, sign: "==", r: null, inside: [] }
                break;
            case ("cfor"): data = { id: this.state.id, type: type, lVar: null, lVal: null, mVar: null, mSign: "<", mVal: null, rVar: null, rSigh: "+=", rVal: null, inside: [] }
                break;
            case ("cwhile"): data = { id: this.state.id, type: type, l: null, sign: "==", r: null, inside: [], indicator: false }
                break;
            case ("cdoWhile"): data = { id: this.state.id, type: type, l: null, sign: "==", r: null, inside: [], indicator: false }
                break;
            case ("inc"): data = { id: this.state.id, type: type, var: null }
                break;
            case ("dec"): data = { id: this.state.id, type: type, var: null }
                break;
            default:
                if (data[0] === 1) {
                    data = { id: this.state.id, type: type.slice(1), params: [] }
                }
                else {
                    data = { id: this.state.id, type: type, dataType: dataType, value: null }
                }

                break;
        }
        this.setState((prevState) => ({
            id: prevState.id + 1
        }));

        return data
    }

    findIndices = (obj) => {
        let indices = [];
        let func = this.state.functions
        let flag = false

        const searchInside = (s) => {
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
        };

        searchInside(func);

        console.log("Indices:", indices);
        return indices;
    };

    insertItem = (obj, indexF, data, position, dnd, empty) => {
        if (data != null) {
            let indices = this.findIndices(obj, indexF);
            let parent = null
            console.log("dndvalue:", obj, indexF, data, position, dnd, indices)
            this.setState(prevState => {
                const updatedFunc = cloneDeep(prevState.functions);
                let x = 0;

                const update = (updated) => {
                    if (x < indices.length) {
                        x++;
                        parent = updated.inside
                        update(updated.inside[indices[x - 1]]);
                    } else {
                        if (dnd) {
                            if (empty) {
                                updated.inside.splice(0, 0, data)
                                return
                            }
                            if (position === "top") {
                                parent.splice(indices[x - 1], 0, data);
                            } else {
                                parent.splice(indices[x - 1] + 1, 0, data);
                            }
                            console.log("Upppppppppppp:", updated)
                        } else {
                            updated.inside.push(data);
                        }
                    }
                };

                update(updatedFunc);

                return { functions: updatedFunc };
            }, () => {
                //console.log("Value:", this.state.functions.inside);
            });
        }
    };

    
    //----------------------------------------
    handleonDragStart = (value) => {
        this.setState({ value: value })
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
        const div = divRef.current;
        const mouseY = e.clientY;
        const objectCenterY = div.getBoundingClientRect().top + div.offsetHeight / 2;

        if (div.offsetHeight > 20) {
            if (mouseY - objectCenterY < 0) {
                div.style.borderTop = '5px solid red';
                div.style.borderBottom = 'none';
            } else {
                div.style.borderBottom = '5px solid red';
                div.style.borderTop = 'none';
            }
        }
        else {
            div.style.backgroundColor = "rgba(200,200,200,1)"
        }



    };


    handleOnDragLeave = (e, divRef) => {
        const div = divRef.current

        if (div.offsetHeight > 20) {
            div.style.borderTop = 'none';
            div.style.borderBottom = 'none';
        }
        else {
            div.style.backgroundColor = "rgba(226,232,240,1)";
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
        let data = this.createItem(this.state.value)
        let position = ""
        let dnd = 1
        const div = divRef.current;
        const mouseY = e.clientY;
        const objectCenterY = div.getBoundingClientRect().top + div.offsetHeight / 2;
        if (mouseY - objectCenterY < 0) {
            position = "top"
        } else {
            position = "bottom"
        }
        console.log("Dropping with:", obj, indexF, data, position, dnd)
        this.insertItem(obj, indexF, data, position, dnd, empty)
    }
    //------------------------------------------

    addDefination = () => {
        this.setState((prevState) => ({
            definations: [...prevState.definations, { "": 0 }]
        }));
    }







    addFunction = (e) => {
        this.setState((prevState) => ({
            functions: [
                ...prevState.functions,
                {
                    showOptions: false,
                    id: this.state.id + 1,
                    name: " ",
                    returnType: e.target.value,
                    params: [

                    ],
                    inside: []
                }
            ],
            id: prevState.id + 1
        }));
        this.setState((prevState) => ({
            showFunctionTypes: false
        }))
    };

    addParameter = (id, e) => {
        let flag = false
        this.setState((prevState) => {

            if (flag === false) {
                flag = true
                const updatedFunctions = [...prevState.functions];
                const index = updatedFunctions.findIndex((obj) => obj.id === id);

                if (index !== -1) {
                    // Create a new parameters array with a single parameter

                }
                const newParameter = {
                    type: e.target.value,
                    name: "c",
                    value: null,
                };
                updatedFunctions[index].params = [...updatedFunctions[index].params, newParameter];

                return {
                    functions: updatedFunctions,
                };
            }
        });
        this.setState((prevState) => ({
            showParamTypes: false
        }))
    };
    setParamType = (id, i, e) => {
        this.state.functions.inside.find((obj) => obj.id === id).params[i].type = e.target.value;

    }
    setFuncName = (id, e) => {
        this.state.functions.inside.find((obj => obj.id === id)).name = e.target.value;
    }


    render() {

        const headers = ["stdio.h", "math.h", "string.h"];
        const dataTypes = ["int", "char", "float"]


        const int = (<div>
            int
            <input
                onChange={(e) => {
                    this.variableName(e);
                    this.adjustInputWidth(e);
                }}
                className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
            />
            =
            <input
                onChange={(e) => {
                    this.intValue(e);
                    this.adjustInputWidth(e);
                }}
                className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
            />;
        </div>)

        const float = (<div>
            float
            <input
                onChange={(e) => {
                    this.variableName(e);
                    this.adjustInputWidth(e);
                }}
                className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
            />
            =
            <input
                onChange={(e) => {
                    this.floatValue(e);
                    this.adjustInputWidth(e);
                }}
                className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
            />;
        </div>)

        const char = (<div>
            char
            <input
                onChange={(e) => {
                    this.variableName(e);
                    this.adjustInputWidth(e);
                }}
                className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
            />
            = '
            <input
                onChange={(e) => {
                    this.charValue(e);
                    this.adjustInputWidth(e);
                }}
                className="w-5 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
            />' ;
        </div>)



        const showInside = (obj, indexF) => {
            const divRef = React.createRef();
            return obj.inside && obj.inside.map((im, i) => {
                switch (im.type) {
                    case "int":
                        return < div >{int}</div>;
                    case "float":
                        return <div>{float}</div>;
                    case "char":
                        return <div>{char}</div>;
                    case "inc":
                        return <div>{inc}</div>;
                    case "dec":
                        return <div>{dec}</div>;
                    case "asign":
                        return <div>{asign(obj, i)}</div>;
                    case "cif":
                        return <div className=" p-2 bg-blue-300">{cif(im, indexF)}</div>;
                    case "celse":
                        return <div className=" p-2 bg-blue-300">{celse(im, indexF)}</div>;
                    case "cfor":
                        return <div
                            ref={divRef}
                            className=" p-2 bg-amber-600 sortable"
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
                        </div>;
                    case "cwhile":
                        return <div
                            ref={divRef}
                            className=" p-2 bg-amber-600 sortable"
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
                            className=" p-2 bg-orange-800 sortable"
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
                        return (
                            <div id={i}>
                                {func(im.type)}
                            </div>
                        );
                }
            })
        }



        const asign = (obj, i) => {
            //const inside = obj.inside[i];

            return (
                <code>
                    <input
                        className="w-20 bg-transparent outline-none border-2 autoAdjust"
                        onChange={() => {
                            this.adjustInputWidth();
                        }}
                    />
                    =
                    <button
                        className="font-bold text-cyan-800 text-xl"
                        onClick={(e) => {

                        }}
                    >
                        +
                    </button>

                </code>
            );
        };


        const func = (functionName) => {
            const selectedFunction = this.state.functions.inside.find(func => func.type === functionName);

            if (!selectedFunction) {
                return null;
            }

            return (
                <div className="inline-block">
                    {functionName} (
                    {selectedFunction.params.map((p, i) => (
                        <span id={i}>
                            {i !== 0 && <span>,</span>}
                            <input
                                onChange={(e) => {
                                    this.floatValue(e);
                                    this.adjustInputWidth();
                                }}
                                className="w-5 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                            />
                        </span>
                    ))}
                    );
                </div>
            );
        };

        const subP = (id) => {
            const obj = this.state.functions.inside.find((obj) => obj.id === id);
            const index = this.state.functions.inside.indexOf(obj);
            let divRef = React.createRef();
            return (
                <div className=" p-2 bg-amber-600 sortable">
                    <code>
                        {obj.returnType}
                        <input
                            className="w-20 bg-transparent outline-none border-2 autoAdjust ml-5"
                            defaultValue={obj.type}
                            onChange={(e) => {
                                this.setFuncName(id, e);
                                this.adjustInputWidth();
                            }}
                        ></input>
                        {"("}
                        {obj.params && obj.params.map((p, i) => (
                            <div id={i} className="items-center inline-flex">
                                {i !== 0 && <p>,</p>}
                                {p.type}
                                <input
                                    className="w-20 bg-transparent outline-none border-2 autoAdjust ml-2"
                                    defaultValue={p.type}
                                    onChange={(e) => {
                                        this.adjustInputWidth();
                                    }}
                                />

                            </div>
                        ))}
                        
                        {") {"}
                        <div className="bg-slate-200 m-4  min-h-4"
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
                                showInside(obj, index)    //show the elements inside subP
                            }
                        </div>
                        <p>{"}"}</p>
                    </code>
                </div>
            );
        };


        const inc = (
            <div>
                <input
                    onChange={(e) => {
                        this.variableName(e);
                        this.adjustInputWidth(e);
                    }}
                    className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                />
                ++;
            </div>
        )

        const dec = (
            <div>
                <input
                    onChange={(e) => {
                        this.variableName(e);
                        this.adjustInputWidth(e);
                    }}
                    className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                />
                --;
            </div>
        )

        const cif = (obj, indexF) => {

            return (
                <div>
                    if(
                    <input
                        onChange={(e) => {
                            this.variableName(e);
                            this.adjustInputWidth(e);
                        }}
                        className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                    />
                    <select className="appearance-none">
                        <option>{'=='}</option>
                        <option>{'<='}</option>
                        <option>{'>='}</option>
                        <option>{'<'}</option>
                        <option>{'>'}</option>
                        <option>{'!='}</option>
                    </select>
                    <input
                        onChange={(e) => {
                            this.intValue(e);
                            this.adjustInputWidth(e);
                        }}
                        className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                    />
                    ){"{"}
                    {showInside(obj, indexF)}

                    <button
                        className="font-bold text-cyan-800 text-xl block"
                        onClick={(e) => {
                            let data = this.createItem(this.state.value)     //create an item to be inserted
                            this.insertItem(obj, indexF, data)
                        }}
                    >
                        +
                    </button>
                    {"}"}
                </div>)
        }

        const celse = (obj, indexF) => {
            return (
                <div>
                    else{'{'}
                    {showInside(obj, indexF)}

                    <button
                        className="font-bold text-cyan-800 text-xl block"
                        onClick={(e) => {
                            let data = this.createItem(this.state.value)     //create an item to be inserted
                            this.insertItem(obj, indexF, data)
                        }}
                    >
                        +
                    </button>
                    {'}'}
                </div>
            )
        }



        const cfor = (obj, indexF) => {
            let divRef = React.createRef();
            return (
                <div>
                    for(
                    <input
                        onChange={(e) => {
                            //this.variableName(e);
                            this.adjustInputWidth(e);
                        }}
                        className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                    />
                    =
                    <input
                        onChange={(e) => {
                            //this.variableName(e);
                            this.adjustInputWidth(e);
                        }}
                        className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                    />
                    ;
                    <input
                        onChange={(e) => {
                            this.variableName(e);
                            this.adjustInputWidth(e);
                        }}
                        className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                    />
                    <select className="appearance-none">
                        <option>==</option>
                        <option>{'<='}</option>
                        <option>{'>='}</option>
                        <option>{'<'}</option>
                        <option>{'>'}</option>
                        <option>{'!='}</option>
                    </select>
                    <input
                        onChange={(e) => {
                            this.intValue(e);
                            this.adjustInputWidth(e);
                        }}
                        className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                    />
                    ;
                    <input
                        onChange={(e) => {
                            this.variableName(e);
                            this.adjustInputWidth(e);
                        }}
                        className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                    />
                    <select className="appearance-none">
                        <option>==</option>
                        <option>{'+='}</option>
                        <option>{'-='}</option>
                        <option>{'*='}</option>
                        <option>{'/='}</option>
                        <option>{'%='}</option>
                        <option>{'++'}</option>
                        <option>{'++'}</option>
                        <option>{'--'}</option>
                    </select>
                    <input
                        onChange={(e) => {
                            this.intValue(e);
                            this.adjustInputWidth(e);
                        }}
                        className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                    />
                    ){'{'}

                    <div className="bg-slate-200 m-4  min-h-4"
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
                        {showInside(obj, indexF)}
                    </div>
                    {'}'}
                </div>)
        }






        const cwhile = (obj, indexF) => {
            let divRef = React.createRef();
            return (
                <div>
                    while(
                    <input
                        onChange={(e) => {
                            this.variableName(e);
                            this.adjustInputWidth(e);
                        }}
                        className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                    />
                    <select className="appearance-none">
                        <option>==</option>
                        <option>{'<='}</option>
                        <option>{'>='}</option>
                        <option>{'<'}</option>
                        <option>{'>'}</option>
                        <option>{'!='}</option>
                    </select>
                    <input
                        onChange={(e) => {
                            this.intValue(e);
                            this.adjustInputWidth(e);
                        }}
                        className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                    />
                    ){'{'}
                    <div className="bg-slate-200 m-4  min-h-4"
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
                        {showInside(obj, indexF)}
                    </div>
                    
                    {'}'}
                </div>
            )
        }

        const cdoWhile = (obj, indexF) => {
            let divRef = React.createRef();
            return (
                <div>
                    do{'{'}
                    <div className="bg-slate-200 m-4  min-h-4"
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
                        {showInside(obj, indexF)}
                    </div>
                   
                    {'}'}
                    <br />
                    while(
                    <input
                        onChange={(e) => {
                            this.variableName(e);
                            this.adjustInputWidth(e);
                        }}
                        className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                    />
                    <select className="appearance-none">
                        <option>==</option>
                        <option>{'<='}</option>
                        <option>{'>='}</option>
                        <option>{'<'}</option>
                        <option>{'>'}</option>
                        <option>{'!='}</option>
                    </select>
                    <input
                        onChange={(e) => {
                            this.intValue(e);
                            this.adjustInputWidth(e);
                        }}
                        className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                    />
                    );
                </div>
            )
        }




        /**********************************************************************************************************************************/



        return (
            <div className="bg-slate-700  flex">
                <div className=" p-5  bg-slate-400 w-1/4 h-screen overflow-y-auto no-scrollbar" >
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
                                <div className="ml-4 flex-col declareVariable">
                                    <button draggable="true" onClick={() => { this.setState({ value: "int" }) }}>int</button>
                                    <button draggable="true" onClick={() => { this.setState({ value: "float" }) }}>float</button>
                                    <button draggable="true" onClick={() => { this.setState({ value: "char" }) }}>char</button>
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
                                <div className="ml-4 flex-col declareVariable">
                                    <button draggable="true" onClick={() => { this.setState({ value: "cif" }) }}>if</button>
                                    <button draggable="true" onClick={() => { this.setState({ value: "celse" }) }}>else</button>
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
                                <div className="ml-4 flex-col declareVariable">
                                    <button draggable="true" onDragStart={() => this.handleonDragStart("cfor")}
                                    >For</button>
                                    <button draggable="true" onDragStart={() => this.handleonDragStart("cwhile")}>While</button>
                                    <button draggable="true" onDragStart={() => this.handleonDragStart("cdoWhile")}>Do-While</button>
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
                                <div className="ml-4 flex-col declareVariable">
                                    {this.state.functions.inside.map((f, i) => (
                                        f.name === " " ? null : (
                                            <button onClick={() => { this.setState({ value: "1" + f.type }) }} id={f.type}>
                                                Call: {f.returnType} {f.type} ({f.params.map((p, i) => (
                                                    (i === 0) ? (
                                                        <span id={i}>{p.type}</span>
                                                    ) :
                                                        (
                                                            <span id={i}>, {p.type}</span>
                                                        )
                                                ))})
                                            </button>)
                                    ))}
                                </div>
                            )
                        }
                    </div>
                    {/*Others */}
                    <div>
                        <div className="font-bold   border-black border-b-2 inline-block mb-2 w-full">
                            <button className="font-bold w-3" onClick={() => this.setState(prevState => ({ showOthers: !prevState.showOthers }))}>
                                {this.state.showOthers ? '-' : '+'}
                            </button>
                            <div className="inline">Others</div>
                        </div>
                        {
                            this.state.showOthers && (
                                <div className="ml-4 flex-col declareVariable">
                                    <button onClick={() => { this.setState({ value: "asign" }) }}>Assignment operation</button>
                                    <button onClick={() => { this.setState({ value: "inc" }) }} >Increment operation</button>
                                    <button onClick={() => { this.setState({ value: "dec" }) }} >Decrement operation</button>
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
                                <p>{`/*`}</p>
                                <ReactTextareaAutosize className="border-2 w-10/12" />
                                <p>{`*/`}</p>
                            </code>
                        </pre>
                    </div>

                    <div className="bg-blue-100 p-4 rounded-lg">
                        <p className="text-right">Link section</p>
                        <pre className="bg-white p-2 rounded-md">
                            <code>
                                {this.state.cheaders.map((h, index) => (
                                    <p id={index}>#include &lt;{h}&gt;</p>
                                ))}
                            </code>
                        </pre>

                        <button
                            className="font-bold text-cyan-800-200 text-xl block"
                            onClick={this.toggleHeaderSelect}
                        >
                            +
                        </button>
                        {this.state.showHeaderSelect && (
                            <select
                                id="headerSelect"
                                className="outline-none"
                                onChange={this.headerSelect}
                                value={this.state.selectedHeader}
                            >
                                {headers.map((h, index) => (
                                    <option id={index} value={h}>
                                        {h}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>


                    <div className="bg-amber-100 p-4 rounded-lg">
                        <p className="text-right">Definition section</p>
                        <pre className="bg-white p-2 rounded-md">
                            <code>
                                #define
                                <input onChange={(e) => {
                                    this.variableName(e);
                                    this.adjustInputWidth(e)
                                }} className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2" />

                                <input onChange={(e) => {
                                    this.floatValue(e);
                                    this.adjustInputWidth(e)
                                }} className=" w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2" />;
                                {this.state.definations.map((d, index) => (
                                    <div id={index}>
                                        <code>
                                            #define
                                            <input
                                                onChange={(e) => {
                                                    this.variableName(e);
                                                    this.adjustInputWidth(e);
                                                }}
                                                className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                                            />
                                            <input
                                                onChange={(e) => {
                                                    this.floatValue(e);
                                                    this.adjustInputWidth(e);
                                                }}
                                                className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                                            />
                                            ;
                                        </code>
                                    </div>
                                ))}

                            </code>
                        </pre>
                        <button onClick={this.addDefination} className="font-bold text-cyan-800-200 text-xl block"> + </button>
                    </div>


                    <div className="bg-lime-100 p-4 rounded-lg">
                        <p className="text-right">Function declaration section</p>
                        <pre className="bg-white p-2 rounded-md">
                            <code>
                                {this.state.functions.inside.map((f, i) => (
                                    i === 0 ? null :
                                        f.name === " " ? null :
                                            (<div>
                                                {f.returnType} {f.name} ({f.params.map((p, i) => (
                                                    (i === 0) ? (
                                                        <span id={i}>{p.type}</span>
                                                    ) :
                                                        (
                                                            <span id={i}>, {p.type}</span>
                                                        )
                                                ))});
                                            </div>)
                                ))}
                            </code>
                        </pre>
                    </div>



                    <div className="bg-green-100 p-4 rounded-lg">
                        <p className="text-right">Global variable section</p>
                        <pre className="bg-white p-2 rounded-md">
                            <code>
                                int
                                <input onChange={(e) => {
                                    this.variableName(e);
                                    this.adjustInputWidth(e)
                                }} className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2" />
                                =
                                <input onChange={(e) => {
                                    this.intValue(e);
                                    this.adjustInputWidth(e)
                                }} className=" w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2" />;

                                {this.state.gVariables.map((v, i) => {
                                    switch (v) {
                                        case "int": return <div>{int}</div>;
                                        case "float": return <div>{float}</div>;
                                        case "char": return <div>{char}</div>
                                        default: return null;
                                    }
                                })}

                            </code>
                        </pre>
                        <button className="font-bold text-cyan-800-200 text-xl block" onClick={(e) => {
                            this.setState((prevState) => ({
                                showDataTypes: !prevState.showDataTypes,
                            }));
                        }}> + </button>
                        {this.state.showDataTypes && (
                            <select
                                id="datatypeSelect"
                                className="outline-none"
                                onChange={(e) => this.dataTypeSelect(e)}
                            /*value={this.state.selectedHeader}*/
                            >
                                {dataTypes.map((t, index) => (
                                    <option id={index} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        )}
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
                                {this.state.functions.inside.map((f, index) => (
                                    index === 0 ? null :
                                        <p id={f.id}>{subP(f.id)}</p>
                                ))}
                            </code>
                        </pre>
                        {/*
                        <button className="font-bold text-cyan-800 text-xl block" onClick={(e) => {
                            this.setState((prevState) => ({
                                showFunctionTypes: !prevState.showFunctionTypes
                            }))
                        }}> + </button>
                        {this.state.showFunctionTypes && (
                            <select onChange={(e) => { this.addFunction(e) }}>
                                <option value="">Choose return type</option>
                                <option value="int">int</option>
                                <option value="bool">bool</option>
                                <option value="char">char</option>
                            </select>
                        )}*/}
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
