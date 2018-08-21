# Tag component

`<Tag />` can be used to visually associate a record with related topics. Tags can be used individually or as part of a `<TagList />`.

## Example

```jsx
<Tag
  dataKey="SomeID"
  deletable
  label="Some Topic"
  onBackSpace={onBackSpace}
  onClick={onClick}
  onDelete={onDelete}
  onDeleteKey={onDeleteKey}
  onNext={onNext}
  onPrevious={onPrevious}
  value="123"
/>
```
## Handlers

* `onBackSpace: (key: string) => void` User hits the _backspace_ key while focus on the tag. 
* `onClick: (key: string) => void` User clicks on the main body of the tag, intending to trigger the tag's primary action.
* `onDelete: (key: string) => void` User clicks the _delete_ button, intending to remove the tag.
* `onDeleteKey: (key: string) => void`: User hits the _delete_ key while focus on the tag.
* `onNext: (key: string) => void`: User hits the _right arrow_ key while focus on the tag.
* `onPrevious: (key: string) => void`: User hits the _left arrow_ key while focus on the tag.

## Properties

* `dataKey: string` Identifier attached to the tag. This key is mandatory and will be passed as an argument to the various handlers attached to the tag. It will also be used as a fallback for `label`.
* `deletable: boolean` Whatever to display a delete button in the tag. Default to `false`.
* `focusable: boolean` Whatever the tag should be in the normal tab sequence. This feature is used by `CompactTagList` who needs to render a placeholder `<TagList />` to measure its width. Defaults to `false`.
* `label: string` Visible text rendered in the tag for the user to view. Defaults to `dataKey` if not provided.
* `value: string` Optional value attached to the tag. This gets displayed next to the label.
* `children: any` If children are provided to the tag, they will override the label and value. This can be use to wrap other component in a tag.

# TagList

A `<TagList />` is used to group related `<Tag>` component together. You can use the backspace, delete, left arrow and right arrow keys to interact with tags in a tag list.

## Example

```jsx
<TagList
  deletable
  onHolderFocus={onHolderFocus}
  onTagClick={onTagClick}
  onTagDelete={onTagDelete}
  tags={[{ key: 'MyId', label: 'Tag Title, value: '123' }]}
/>
```

## Handlers

* `onHolderFocus: () => void` Fired when the user performs an action that would normally return the focus to the parent container of the tag list. e.g.: Using the right arrow on the last tag of the list or deleting all the tags from the list.
* `onTagClick: (key: string) => void` Interacting with a specific tag.
* `onTagDelete: (key: string) => void` Performing a delete action on a tag. Either clicking the delete button or pressing the backspace/delete key on a tag.

## Properties

* `deletable: boolean` Whatever the tags should have a delete button. Default to `false`.
* `focusable: boolean` Whatever the tags should be in the normal tab sequence. Defaults to `false`.
* `tags: {key: string, label?: string, value?: string}[]` Data that will be use to generate the tags. Only the `key` attribute is mandatory and it must be unique within a single tag list.

# CompactTagList

`<CompactTagList />` is a size-aware extension of `<TagList />`. It accepts the same props as tag list as well as a `maxSize` numeric value. If the tag list becomes wider than `maxSize`, the compact tag list will switch to a summary view showing a simple tag count.

## Example

```jsx
<CompactTagList
  maxSize={200}
  deletable
  onHolderFocus={onHolderFocus}
  onSummary={onSummary}
  onTagClick={onTagClick}
  onTagDelete={onTagDelete}
  tags={[{ key: 'MyId', label: 'Tag Title, value: '123' }]}
/>
```

## Handlers

* `onSummary: () => void` Fired when the user click the summary view.
* All the regular _TagList_ handlers.

## Properties

* `maxSize: number` Width in pixels beyond which the summary view will be triggered.
* All the regular _TagList_ props.
