class LanguageTextFilter {

    public static translateQuestionText( surveyHandler: any, question: any ) {
        if ( surveyHandler.ccsdk.config.language.indexOf( 'Default' ) === -1 ) {
            if ( question.translated != null &&
                typeof question.translated[ surveyHandler.ccsdk.config.language ] !== 'undefined' ) {
                if ( question.translated[ surveyHandler.ccsdk.config.language ].text ) {
                    let qText = question.translated[ surveyHandler.ccsdk.config.language ].text.split( ':' );
                    if ( question.translated[ surveyHandler.ccsdk.config.language ].text.indexOf( ":" ) !== -1 ) {
                        qText = qText[ 0 ] + ': <br><span class="text-normal">' + qText[ 1 ] + '</span>';
                    }
                    return qText;
                }
                // else if ( question.translated[ surveyHandler.ccsdk.config.language ].text ) {
                //     return question.translated[ surveyHandler.ccsdk.config.language ].text;
                // }
                // return question.translated[surveyHandler.ccsdk.config.language].text;
            }
        }
        if ( question.text ) {
            let qText = question.text.split( ':' );
            if ( question.text.indexOf( ":" ) !== -1 ) {
                qText = qText[ 0 ] + ': <br><span class="text-normal">' + qText[ 1 ] + '</span>';
            }
            return qText;
        } else {
            return question.text == null ? '' : question.text;
        }
    }

    public static translateMessages( surveyHandler: any, type: string ) {
        if ( surveyHandler.surveyData.translated != null && typeof surveyHandler.surveyData.translated[ surveyHandler.ccsdk.config.language ] !== 'undefined' ) {
            if ( surveyHandler.ccsdk.config.language.indexOf( 'Default' ) === -1 ) {
                if ( surveyHandler.surveyData.translated[ surveyHandler.ccsdk.config.language ] !== 'undefined' ) {
                    if ( surveyHandler.surveyData.translated[ surveyHandler.ccsdk.config.language ][ type ] != null ) {
                        return surveyHandler.surveyData.translated[ surveyHandler.ccsdk.config.language ][ type ];
                    } else {
                        return surveyHandler.surveyData[ type ];
                    }
                } else {
                    return surveyHandler.surveyData[ type ];
                }
            } else {
                return surveyHandler.surveyData[ type ];
            }
        }
    }

    public static translateDisplayLegend( surveyHandler: any, question: any ) {
        if ( surveyHandler.ccsdk.config.language.indexOf( 'Default' ) === -1 ) {
            if ( question.translated != null &&
                typeof question.translated[ surveyHandler.ccsdk.config.language ] !== 'undefined' ) {
                return question.translated[ surveyHandler.ccsdk.config.language ].displayLegend;
            } else {
                return question.displayLegend;
            }
        } else {
            return question.displayLegend;
        }
    }

    public static translateMultiSelect( surveyHandler: any, question: any ) {
        if ( surveyHandler.ccsdk.config.language.indexOf( 'Default' ) === -1 ) {
            if ( question.translated != null &&
                typeof question.translated[ surveyHandler.ccsdk.config.language ] !== 'undefined' &&
                question.translated[ surveyHandler.ccsdk.config.language ].multiSelect
            ) {
                let translatedOptions = question.translated[ surveyHandler.ccsdk.config.language ].multiSelect;
                return question.multiSelect.map( ( x, i ) => {
                    if ( translatedOptions[ i ] ) {
                        return translatedOptions[ i ];
                    } else {
                        return x;
                    }
                } );
            } else {
                return question.multiSelect;
            }
        } else {
            return question.multiSelect;
        }
    }

    public static translateMultiSelectOption( surveyHandler: any, question: any, option: any ) {
        let effectiveMultiselect = this.translateMultiSelect( surveyHandler, question );
        if ( ( effectiveMultiselect instanceof Array ) && effectiveMultiselect.length > 0 ) {
            for ( let i = 0; i < question.multiSelect.length; i++ ) {
                let opt: any = question.multiSelect[ i ].split( ';' )
                if ( opt[ 0 ] == option ) {
                    return effectiveMultiselect[ i ].split( ';' )[ 0 ];
                } else {

                }
            }
        }
        return option;
    }

}

export { LanguageTextFilter };