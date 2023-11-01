import React from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

class Code extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHeaderSelect: false,
            showDataTypes: false,
            selectedHeader: "",
            cheaders: ["stdio.h"],
            definations: [],
            gVariables: []
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
        console.log("jkdhkjsah" + this.state.gVariables)
    };

    adjustInputWidth = () => {
        const inputs = document.getElementsByClassName('autoAdjust'); // Replace 'myInput' with the actual class of your input fields

        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            input.style.width = '40px'; // Reset width to 'auto' to get the natural width
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

    value = (event) => {
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


    addDefination = () => {
        this.setState((prevState) => ({
            definations: [...prevState.definations, { "": 0 }]
        }));
    }





    render() {
        const headers = ["stdio.h", "math.h", "string.h"];
        const dataTypes = ["int", "char", "float"]

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
                                    this.value(e);
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
                                                    this.value(e);
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
                                <select className="appearance-none">
                                    <option>int</option>
                                    <option>bool</option>
                                </select>
                                <input onChange={(e) => {
                                    this.variableName(e);
                                    this.adjustInputWidth(e)
                                }} className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2" />

                                <input onChange={(e) => {
                                    this.value(e);
                                    this.adjustInputWidth(e)
                                }} className=" w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2" />;

                                {this.state.gVariables.map((v, i) => (
                                    <div key={i}>
                                        {v}
                                        <input
                                            onChange={(e) => {
                                                this.variableName(e);
                                                this.adjustInputWidth(e);
                                            }}
                                            className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                                        />
                                        <input
                                            onChange={(e) => {
                                                this.value(e);
                                                this.adjustInputWidth(e);
                                            }}
                                            className="w-10 autoAdjust bg-transparent outline-none border-2 border-slate-50 m-2"
                                        />;
                                    </div>
                                ))}

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
                                onChange={(e)=>this.dataTypeSelect(e)}
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
                                <button className="font-bold text-cyan-800 text-xl block">
                                    +
                                </button>
                                <p>{"}"}</p>
                            </code>
                        </pre>
                    </div>



                    <div className="bg-purple-100 p-4 rounded-lg">
                        <p className="text-right">Subprogram section</p>
                        <pre className="bg-white p-2 rounded-md">
                            <code>
                                <select className="appearance-none">
                                    <option>int</option>
                                    <option>bool</option>
                                </select>
                                <input
                                    className="w-20 bg-transparent outline-none border-2"
                                ></input>
                                (
                                <select className="appearance-none">
                                    <option>int</option>
                                    <option>bool</option>
                                </select>
                                <input
                                    className="w-20 bg-transparent outline-none border-2"
                                ></input>
                                <button className="font-bold text-cyan-800 text-xl"> + </button>
                                ) {"{"}
                                <button className="font-bold text-cyan-800 text-xl block">
                                    +
                                </button>
                                <p>{"}"}</p>
                            </code>
                        </pre>
                        <button className="font-bold text-cyan-800 text-xl block"> + </button>
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
