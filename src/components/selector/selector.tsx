import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { SelectListMember } from '../../types/selector.type';
import { uniqBy } from '../../utils';

@Component({
  styleUrl: 'selector.scss',
  tag: 'cronk-selector',
})
export class CronkSelector {
  @State() activeSelection: any = {};
  @State() reference?: SelectListMember[];
  @State() referenceTotal = 0;

  /** Custom heading for the selector */
  @Prop() heading = '';
  /** Label for each selectable - default 'COUNT' */
  @Prop() label = 'COUNT';
  /** a value that will be used to filter data streams by */
  @Prop() selector: any;
  /** a list of selectable members {select, label, count}[] */
  @Prop() selectList: SelectListMember[] = [];
  /** Should all selectable members be selected on initial render */
  @Prop() selectAllOnLoad = true;
  /** Minimum number of selected members */
  @Prop() minimumSelection = 0;

  @Watch('selectList')
  async updateSelectList(): Promise<void> {
    if (!this.selectList.length) {
      return;
    }
    const newReference: SelectListMember[] = uniqBy(this.selectList, 'select').map(s => {
      s.label = s.label.replace(/(.{5}).+(.{5})/g, '$1...$2');
      return s;
    });
    if (this.reference === undefined || newReference.length > this.reference.length) {
      this.reference = newReference;
      this.referenceTotal = newReference.reduce(
        (newTotal: number, newRef: SelectListMember) => newTotal + (newRef.count || 0),
        0,
      );
      if (!this.selectAllOnLoad) return;

      const active = Object.assign(
        {},
        ...newReference.map((selection: SelectListMember) => {
          return {
            [selection.select]:
              this.activeSelection[selection.select] === undefined ? true : this.activeSelection[selection.select],
          };
        }),
      );
      this.activeSelection = active;
    }
  }

  private unsetAllActive(reference: SelectListMember[]) {
    return Object.assign(
      {},
      ...reference.map((selection: SelectListMember) => {
        return {
          [selection.select]: false,
        };
      }),
    );
  }

  private setAllActive(reference: SelectListMember[]) {
    return Object.assign(
      {},
      ...reference.map((selection: SelectListMember) => {
        return {
          [selection.select]: true,
        };
      }),
    );
  }

  private selectAllThings(event: Event) {
    if (!this.reference) return;
    const el = event.target as HTMLIonCheckboxElement;
    this.activeSelection = el && !el.checked ? this.unsetAllActive(this.reference) : this.setAllActive(this.reference);
    this.selectThingHandler();
  }

  private toggleThingSelection(_: Event, { select }: SelectListMember) {
    this.activeSelection = { ...this.activeSelection, [select]: !this.activeSelection[select] };
    this.selectThingHandler();
  }

  private selectThingHandler() {
    const selectedThings = Object.entries(this.activeSelection)
      .filter(([_, selected]) => selected)
      .map(([thing]) => thing);
    const newFilter = (blob: any) => {
      if (this.selector in blob) {
        return selectedThings.includes(blob[this.selector]);
      }
      return true; // Only filter if it has what you're looking for
    };

    document.querySelectorAll('.cronk-filtered-datastream').forEach((stream: any) => {
      stream.addFilter(this.selector, newFilter);
    });
  }

  private handleSelectAll = () => (e: Event) => this.selectAllThings(e);

  private handleToggle = (b: SelectListMember) => (e: Event) => this.toggleThingSelection(e, b);

  render() {
    if (this.reference === undefined) return;

    const selectedThingsLength = Object.values(this.activeSelection).filter(x => !!x).length;
    return (
      <Host class={`${this.selector}-selector thing-selector`}>
        {this.heading ? <h5>{this.heading}</h5> : null}
        <table class="fixed">
          <thead>
            <tr>
              <th>
                <ion-item lines="none" class={`select-all-things select-all-${this.selector}`}>
                  {this.reference.length > 1 && (
                    <ion-checkbox
                      onClick={this.handleSelectAll()}
                      value="selectall"
                      checked={this.reference.length === selectedThingsLength}
                      indeterminate={this.reference.length > selectedThingsLength && selectedThingsLength > 0}
                      color="secondary"
                      slot="start"
                    />
                  )}
                  <span class="select-label">{`${this.reference.length > 1 ? 'SELECT ' : ''}`}</span>
                </ion-item>
              </th>
              <th />
              <th>{this.label}</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {this.reference &&
              this.reference.map((b: SelectListMember) => {
                const { select, label, count } = b;
                const proportion = count / this.referenceTotal;

                return (
                  <tr key={select}>
                    <td>
                      <ion-item lines="none">
                        {this.reference && this.reference.length > 1 && (
                          <ion-checkbox
                            onClick={this.handleToggle(b)}
                            checked={select in this.activeSelection && this.activeSelection[select]}
                            value={select}
                            slot="start"
                            color="secondary"
                          />
                        )}
                        <ion-label>{label}</ion-label>
                      </ion-item>
                    </td>
                    <td>
                      <ion-progress-bar value={proportion} />
                    </td>
                    <td>{count}</td>
                    <td>({(proportion * 100).toFixed(1)}%)</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </Host>
    );
  }
}
