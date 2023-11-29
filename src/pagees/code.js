import React from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

class Code extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHeaderSelect: false,
            showDataTypes: false,
            showMainOptions: false,
            selectedHeader: "",
            cheaders: ["stdio.h"],
            definations: [],
            gVariables: [],
            insideMain: [],
            functionKey: 1,
            functions: [
                {
                    key: 1,
                    name: "sum",
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
                    ]
                },
            ]
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







    addDefination = () => {
        this.setState((prevState) => ({
            definations: [...prevState.definations, { "": 0 }]
        }));
    }

    addInsideMain = (e) => {
        const val = (e.target.value === "func") ? e.target.key : e.target.value;

        this.setState((prevState) => ({
            insideMain: [...prevState.insideMain, val],
            showMainOptions: !prevState.showMainOptions
        }));
    }

    addFunction = () => {
        this.setState((prevState) => ({
            functions: [
                ...prevState.functions,
                {
                    key: this.state.functionKey + 1,
                    name: " ",
                    returnType: "int",
                    params: [

                    ]
                }
            ],
            functionKey: prevState.functionKey + 1
        }));
    };

    addParameter = (key) => {
        let flag = false
        console.log("Addparams is called")
        this.setState((prevState) => {

            if (flag === false) {
                flag = true
                const updatedFunctions = [...prevState.functions];
                const index = updatedFunctions.findIndex((obj) => obj.key === key);

                if (index !== -1) {
                    // Create a new parameters array with a single parameter

                }
                const newParameter = {
                    type: "int",
                    name: "c",
                    value: null,
                };
                updatedFunctions[index].params = [...updatedFunctions[index].params, newParameter];
                console.log(updatedFunctions)

                return {
                    functions: updatedFunctions,
                };
            }
        });
    };
    setParamType = (key, i, e) => {
        this.state.functions.find((obj) => obj.key === key).params[i].type = e.target.value;

    }
    setFuncName = (key, e) => {
        this.state.functions.find((obj => obj.key === key)).name = e.target.value;
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

        const func = (functionName) => {
            const selectedFunction = this.state.functions.find(func => func.name === functionName);

            if (!selectedFunction) {
                return null;
            }

            return (
                <div>
                    {functionName} (
                    {selectedFunction.params.map((p, i) => (
                        <span key={i}>
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

        const subP = (key) => {
            const obj = this.state.functions.find((obj) => obj.key === key);

            return (
                <div>
                    <code>
                        <select className="appearance-none" defaultValue={obj.returnType}>
                            <option>int</option>
                            <option>bool</option>
                        </select>
                        <input
                            className="w-20 bg-transparent outline-none border-2 autoAdjust"
                            defaultValue={obj.name}
                            onChange={(e) => {
                                this.setFuncName(key, e);
                                this.adjustInputWidth();
                            }}
                        ></input>
                        {"("}
                        {obj.params && obj.params.map((p, i) => (
                            <div key={i} className="items-center inline-flex">
                                {i !== 0 && <p>,</p>}
                                <select className="appearance-none mr-2" defaultValue={p.type} onChange={(e) => this.setParamType(key, i, e)}>
                                    <option>int</option>
                                    <option>bool</option>
                                </select>
                                <input
                                    className="w-20 bg-transparent outline-none border-2 autoAdjust"
                                    defaultValue={p.name}
                                    onChange={(e) => {
                                        this.adjustInputWidth();
                                    }}
                                />

                            </div>
                        ))}
                        <button className="font-bold text-cyan-800 text-xl" onClick={() => this.addParameter(key)}> + </button>
                        {") {"}

                        <button className="font-bold text-cyan-800 text-xl block"> + </button>
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

        const cif = (
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
                ){"{"}
                <button className="font-bold text-cyan-800 text-xl block"> + </button>
                {"}"}
            </div>
        )

        const cifElse= (
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
                ){"{"}
                <button className="font-bold text-cyan-800 text-xl block"> + </button>
                {"}"}
                else{'{'}
                <button className="font-bold text-cyan-800 text-xl block"> + </button>
                {'}'}
            </div>
        )

        const celseIf= (
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
                ){"{"}
                <button className="font-bold text-cyan-800 text-xl block"> + </button>
                {"}"}
                <br/>
                else if(
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
                ){"{"}
                <button className="font-bold text-cyan-800 text-xl block"> + </button>
                {"}"}

                <button className="font-bold text-cyan-800 text-xl block"> + </button>

                else{'{'}
                <button className="font-bold text-cyan-800 text-xl block"> + </button>
                {'}'}
            </div>
        )

        const cfor = (
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
                <button className="font-bold text-cyan-800 text-xl block"> + </button>
                {'}'}
            </div>
        )

        const cwhile = (
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
                <button className="font-bold text-cyan-800 text-xl block"> + </button>
                {'}'}
            </div>
        )

        const cdoWhile=(
            <div>
                do{'{'}
                <button className="font-bold text-cyan-800 text-xl block"> + </button>
                {'}'}
                <br/>
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

        return (
            <div className="bg-slate-700">
                <div className="space-y-4 p-10 m-20 mt-0 mb-0 bg-gray-100">
                    <p className="font-bold text-2xl">Main.c</p>

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
                                    <p key={index}>#include &lt;{h}&gt;</p>
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
                                    <option key={index} value={h}>
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
                                    <div key={index}>
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
                            <code></code>
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
                                    <option key={index} value={t}>
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
                                <p>int main() {"{"}</p>
                                {this.state.insideMain.map((im, i) => {
                                    switch (im) {
                                        case "int":
                                            return <div>{int}</div>;
                                        case "float":
                                            return <div>{float}</div>;
                                        case "char":
                                            return <div>{char}</div>;
                                        case "inc":
                                            return <div>{inc}</div>;
                                        case "dec":
                                            return <div>{dec}</div>;
                                        case "cif":
                                            return <div>{cif}</div>;
                                        case "cfor":
                                            return <div>{cfor}</div>;
                                        case "cwhile":
                                            return <div>{cwhile}</div>;
                                        case "cdoWhile":
                                            return <div>{cdoWhile}</div>
                                        default:
                                            if (im.startsWith("1")) {
                                                const funcName = im.slice(1);
                                                return (
                                                    <div key={i}>
                                                        {func(funcName)}
                                                    </div>
                                                );
                                            }
                                            return null;
                                    }
                                })}
                                <button
                                    className="font-bold text-cyan-800 text-xl block"
                                    onClick={(e) => {
                                        this.setState({
                                            showMainOptions: !this.state.showMainOptions
                                        });
                                    }}
                                >
                                    +
                                </button>
                                {this.state.showMainOptions && (
                                    <select
                                        className="outline-none border-2 w-max"
                                        onChange={this.addInsideMain}
                                    >
                                        <option>Choose an option</option>
                                        <option value="int">Declare an int variable</option>
                                        <option value="float">Declare a float variable</option>
                                        <option value="char">Declare a char variable</option>
                                        <option value="asign">Assignment operation</option>
                                        <option value="cif">if</option>
                                        <option value="cifElse">if else</option>
                                        <option value="celseIf">else if</option>
                                        <option value="cfor">For</option>
                                        <option value="cwhile">While</option>
                                        <option value="cdoWhile">Do-While</option>
                                        <option value="inc">Increment operation</option>
                                        <option value="dec">Decrement operation</option>
                                        {this.state.functions.map((f, i) => (
                                            <option value={"1" + f.name} key={f.name}>
                                                Call: {f.returnType} {f.name} ({f.params.map((p, i) => (
                                                    (i === 0) ? (
                                                        <span key={i}>{p.type}</span>
                                                    ) :
                                                        (
                                                            <span key={i}>, {p.type}</span>
                                                        )
                                                ))})
                                            </option>
                                        ))}


                                    </select>
                                )}



                                <p>{"}"}</p>
                            </code>
                        </pre>
                    </div>



                    <div className="bg-purple-100 p-4 rounded-lg">
                        <p className="text-right">Subprogram section</p>

                        <pre className="bg-white p-2 rounded-md">
                            <code>
                                {this.state.functions.map((f, index) => (
                                    <p key={f.key}>{subP(f.key)}</p>
                                ))}
                            </code>
                        </pre>
                        <button className="font-bold text-cyan-800 text-xl block" onClick={this.addFunction}> + </button>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button className="align-middle m-5 border-2 w-24 h-12 bg-lime-200">
                        Run
                    </button>
                </div>
            </div>
        );
    }
}

export default Code;
