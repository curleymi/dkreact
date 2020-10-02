import React from "react";

class ITunesApiTab extends React.Component {

    static Title = 'iTunes Api';

    termParameter = 'term';
    searchedTermParameter = 'searchedTerm';
    resultsParameter = 'results';
    loadingParameter = 'loading';

    route = 'https://itunes.apple.com/search?';
    fetchParameters = [
        { key: 'country', value: 'US'},
        { key: 'media',   value: 'music'}
    ];
    baseFetchRoute;

    constructor(props) {
        super(props);
        this.state = {
            term: '',
            searchedTerm: '',
            results: [],
            loading: false,
        };
        this.buildBaseFetchRoute();
    }

    buildBaseFetchRoute() {
        this.baseFetchRoute = `${this.route}?`;
        for (var i in this.fetchParameters) {
            var param = this.fetchParameters[i];
            this.baseFetchRoute += `${param.key}=${param.value}&`;
        }
    }

    buildTermFetchRoute() {
        return this.baseFetchRoute + `${this.termParameter}=${this.state.term}`;
    }

    updateState(name, value) {
        console.log(`NEW STATE - ${name}: ${JSON.stringify(value)}`);
        return this.setState({[name]: value});
    }

    resetState() {
        this.updateState(this.termParameter, '');
        this.updateState(this.searchedTermParameter, '');
        this.updateState(this.resultsParameter, []);
        this.termInput.focus();
    }

    setLoadingState(value) {
        this.updateState(this.loadingParameter, value);
    }

    onTermChange(event) {
        this.updateState(event.target.name, event.target.value)
    }

    onTermKeyEvent(event) {
        if (event.key === 'Enter') {
            this.iTunesFetch();
        }
    }

    iTunesErrorCallback(msg) {
        this.updateState(this.resultsParameter, [{error: `Exception thrown: ${msg}`}]);
        this.setLoadingState(false);
    }

    iTunesSuccessCallback(response) {
        if (response.status !== 200) {
            this.iTunesErrorCallback(`Request returned non-success code: ${response.status}`)
        } else {
            response.json().then(rawJson => {
                this.updateState(this.resultsParameter, rawJson.results);
                this.setLoadingState(false);
            });
        }
    }

    iTunesFetch() {
        this.setLoadingState(true);
        this.updateState(this.searchedTermParameter, this.state.term)
        var fetchTermRoute = this.buildTermFetchRoute();
        console.log(`FETCHING FROM - "${fetchTermRoute}"`);
        fetch(fetchTermRoute, { method: 'GET', mode: 'cors'})
            .then(response => this.iTunesSuccessCallback(response))
            .catch(err => this.iTunesErrorCallback(err));
    }

    listHandler(msg) {
        console.log(msg);
    }

    resultMapRenderer(result, handle) {
        if (result.error) {
            return <h3 key='error' style={{color: 'red'}}>{result.error}</h3>;
        }

        return <li key={result.previewUrl}>
            <a href={result.previewUrl} target='_blank' rel='noopener noreferrer'>
                <b>{result.trackName}</b>
            </a>
            <p>Artist: {result.artistName}</p>
            <p>{result.kind === 'song' ?
                `Album: ${result.collectionName}` :
                result.kind === 'music-video' ?
                'Music Video' :
                `Unexpected Kind: ${result.kind}`}
            </p>
        </li>;
    }

    render() {
        // modal first -> active
        return (
            <div>
                <p>Enter term to search for from <b>{this.route}</b></p>
                <div>
                    <input name={this.termParameter}
                        type='text'
                        value={this.state.term}
                        ref={(termInput) => this.termInput = termInput}
                        onChange={event => this.onTermChange(event)}
                        onKeyUp={event => this.onTermKeyEvent(event)}/>
                    <span>&nbsp;&nbsp;</span>
                    <button
                        disabled={this.state.loading}
                        onClick={() => this.iTunesFetch()}
                        >Search Music
                    </button>
                    <span>&nbsp;&nbsp;</span>
                    <button
                        disabled={this.state.loading}
                        onClick={() => this.resetState()}
                        >Clear
                    </button>
                    <span>&nbsp;&nbsp;</span>
                    <span>{this.state.loading ? 'Loading' : ''}</span>
                </div>
                <h3>Results for: {this.state.searchedTerm}</h3>
                <ol name={this.resultsParameter}>
                    {this.state.results.map(res => this.resultMapRenderer(res, this.listHandler))}
                </ol>
            </div>
        );
    }
}

export default ITunesApiTab;