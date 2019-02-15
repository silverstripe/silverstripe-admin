export interface ConfigSection {
    form: {
        EditorEmailLink: {
            schemaUrl: string
        },
        EditorExternalLink: {
            schemaUrl: string
        }
    },
    graphql: {
        cachedTypenames: boolean
    },
    name: string,
    url: string
}