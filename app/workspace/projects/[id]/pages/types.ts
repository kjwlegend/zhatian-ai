export interface Component {
  id: string
  name: string
  type: string
}

export interface Page {
  id: string
  title: string
  components: Component[]
}

