import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { ScreenSpinner, Alert, View, Panel, PanelHeader, Group, InfoRow,FormLayout, FormLayoutGroup, Input,Select,Radio,Textarea,Checkbox, Link, Button,Div, Slider} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';


var user = {first_name: "",last_name:"", sex:0, id:0};

var inputsNames={
	"sex":'Пол',"first_name" : 'Имя',"last_name": 'Фамилия',
	"id": 'Ид',"myTarget":'Цель',"old":'Возраст',
	"height":'Рост',"weight": 'Вес', "sport" : 'Вид спорта',
	"dayssport": 'Дней спорта',"hoursport": 'Часов спорта',
	"typefig": 'Тип фигуры',"typejob": 'Тип работы',
	"dailyActivity": 'Дневная активность',"hormonalDisorder": 'Гормональные нарушения',
	"stressLevel": 'Уровень стресса',"sleep": 'Количество часов сна',
	"girthNeck": 'Обхват шеи', "girthWaist" : 'Обхват талии', "girthHits": 'Обхват бедер',

'averageWeight':'Средний вес',
"minWeight": 'Минимальный вес', "averageStep": 'Среднее кол. шагов',"rateTrainings": 'Тренировки',
"rateNutrition": 'Питание',"rateHunger": 'Уровень голода'
}


class App extends React.Component {
	constructor(props) {
		super(props);
		this.reg_fields= ["sex","first_name","last_name","id","myTarget","old","height","weight","sport","dayssport","hoursport","typefig","typejob","dailyActivity","hormonalDisorder","stressLevel","sleep","girthNeck","girthWaist","girthHits"]
		this.week_fields= ["sex","id","weekNumber","averageWeight","minWeight","averageStep","rateTrainings","rateNutrition","rateHunger","girthNeck","girthWaist","girthHits"]

  	this.textInput = React.createRef();

		this.state = {
			popout: null,
			activePanel: 'home',
			fetchedUser: null,
			config: window.config,
			formReg: {
				sex:0,
				first_name:' ',
				last_name:' ',
        registered: -1, //-1 состояние неизвестно,0 - новый, 1- зареган
        message2user: ['','','']
			}
		};
		//из конфига
		this.text = window.text

	}

	componentDidMount() {

		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppGetUserInfoResult':
					//получение инфы от ВК
					user=e.detail.data
					this.setState({ fetchedUser: user ,
            config: window.config,
            afterReg:0, //если только что после регистрации
            formReg: {
						sex:user.sex,
						first_name:user.first_name,
						last_name:user.last_name,
						id:user.id
					}});

					this.checkUser();
					break;
				default:

					//console.log(e.detail.type);
			}
		});
		connect.send('VKWebAppGetUserInfo', {});
	}
//сохранение контекста через стрел. ф. или bind
	ChangeSt=(event)=> {
			let arr =this.state.formReg
      if(event.target.type=="checkbox") arr[event.target.name] = event.target.checked
	    else arr[event.target.name] = event.target.value

			if(event.target.type=="radio") event.target.checked = 'checked'

	    this.setState({formReg: arr } )
			console.log(this.state.formReg,event.target.type)
//для показа элементов
/*			let t,i=0;
			for (let key in this.state.formReg) {
t+='"'+key+'",'
i++;
}
console.log(t,i)*/
	}

	checkForm(type){
		var resultCheck=[];
				switch (type) {
					case 0:
						{ //без этой скобки не работает let
							let checkArray = this.reg_fields
							for (let key in this.state.formReg) {
									var index = checkArray.indexOf(key);
									if (index > -1) {
									  checkArray.splice(index, 1);
									}
								}
								if(this.state.formReg.sex==2){
									index = checkArray.indexOf('girthHits');
									if (index > -1) {
										checkArray.splice(index, 1);
									}
								}
								if(checkArray.length>0) {resultCheck=checkArray}
								else return true
							}
					break;
					case 1:
						{ //без этой скобки не работает let
							let checkArray = this.week_fields
							for (let key in this.state.formReg) {
									var index = checkArray.indexOf(key);
									if (index > -1) {
									  checkArray.splice(index, 1);
									}
								}
								if(this.state.formReg.sex==2){
									index = checkArray.indexOf('girthHits');
									if (index > -1) {
										checkArray.splice(index, 1);
									}
								}
								if(checkArray.length>0) {resultCheck=checkArray}
								else return true
							}
					break;
					default:	return true;
				}

				if(resultCheck.length>0){
					console.log(resultCheck)
					let mes = this.text.notFilled;
					mes += resultCheck.reduce(function(sum, current) {
  					if(inputsNames[current]) return sum+ inputsNames[current] +', ' ;
						else return sum+ current  +', ';
					}, '');
					this.openDialog (mes)
				}
				return false
		}

		openDialog (text) {
		    this.setState({ popout:
		      <Alert
		        actions={[{
		          title: 'Close',
		          autoclose: true,
		          style: 'destructive'
		        }]}
		        onClose={ () => this.setState({ popout: null }) }
		      >
		        <h2>{this.text.headAlert}</h2>
		        <div className="content" dangerouslySetInnerHTML={{__html: text}}></div>
		      </Alert>
		    });
				connect.send("VKWebAppScroll", {"top": document.body.scrollHeight/2 , "speed": 600});
		  }

checkUser=()=>{
	this.setState({ popout: <ScreenSpinner /> });
  fetch(this.state.config.urlPhpServer+'checkuser.php?userID='+this.state.formReg.id)
    .then(res => res.text())
    .then(data=> {
			this.setState({popout: null})
      console.log('Request succeeded with response:',data)
      let dataJSON=JSON.parse(data);
			console.log(dataJSON)
      if(dataJSON.reg){
				let sexNumber = {'муж':2, 'жен': 1}
        let sex=(dataJSON.sex=="муж" | dataJSON.sex=="жен")? sexNumber[dataJSON.sex] : this.state.formReg.sex;
        this.setState({registered: 1, message2user: dataJSON.message2user, formReg:{sex: sex, id: this.state.formReg.id, weekNumber: dataJSON.lastWeek }})
      }
      else
        this.setState({registered: 0})
    }).catch(error => {
			this.openDialog (this.text.servError)
      console.log(error);
  });
}

	ajaxSend=(type)=>{
      let counter = 0;
      for (var key in this.state.formReg) {
        counter++;
      }
      /*if (!type && ((counter<20 && this.state.formReg.sex==2) || (counter<22 && this.state.formReg.sex==1)) ||
        type && ((counter<11 && this.state.formReg.sex==2) || (counter<13 && this.state.formReg.sex==1))
      ) {
            this.openDialog("Необходимо заполнить все поля");
      }*/
			if(!this.checkForm(type)){}
      else{
        this.setState({ popout: <ScreenSpinner /> });
        var data = new FormData();
        data.append( "json", JSON.stringify( this.state.formReg ) );
        /* https://ftvkapp.beget.tech/saveUser.php */
        console.log(JSON.stringify( this.state.formReg ));

        if(type) var url = this.state.config.urlPhpServer+"saveweek.php";
        else var url = this.state.config.urlPhpServer+"saveuser.php"

        fetch(url, {
          method: 'post',
          body: data
        })
        .then(res => res.text())
        .then( data=> {
          this.setState({popout: null})
          console.log('Request succeeded with response:', data);
          let dataJSON=JSON.parse(data);
          if(dataJSON['error']){
            this.openDialog(dataJSON['error']);
          }else{
              this.setState({activePanel: 'home',registered: true, afterReg:1, message2user:"Данные записаны. Следите за комментариями от нашей команды =)"})
              this.openDialog(this.text.dataSave);
							connect.send("VKWebAppScroll", {"top": 1, "speed": 600});
          }



        })
        .catch(error => {
					this.setState({popout: null})
					this.openDialog (this.text.servError)
          console.log(error);

      });

      }

    return this;
	}

	go= (e)=>{
		this.setState({ activePanel: e.currentTarget.dataset.to })
	};


	Num($inp) {
    /*if(isNaN(Number($inp))){
      return null;
    }
    else{
      return Number($inp);
    }*/
		if(isNaN($inp)) return '';
	}



	render() {

    // краткость сестра таланта
let $=this.state.formReg;
var Num=this.Num;
var ChangeSt=this.ChangeSt;
var ifChecked=this.ifChecked;
var v,n; // для значений и имен инпутов и радио
var text=this.text
//установка размеров окна для разных вкладок
if(this.state.activePanel == 'newuser')
	connect.send("VKWebAppResizeWindow", {"width": 750, "height": 3700});
else if(this.state.activePanel == 'everyWeek'){
	connect.send("VKWebAppResizeWindow", {"width": 750, "height": 1600});
}
else{
connect.send("VKWebAppResizeWindow", {"width": 750, "height": 800});
}
		return (

<View activePanel={this.state.activePanel} popout={this.state.popout}>
  <Panel id="home" theme="white">
    <PanelHeader>{text.head}</PanelHeader>

        <Div><InfoRow title="">
           {text.intro}
          </InfoRow>
				</Div>
				{ this.state.message2user ?
				<Div>
					<Div>
						<InfoRow title="Актуальная планка:">
	           <pre>{this.state.message2user[0][1]}
							 </pre>
	          </InfoRow>
					</Div>
					<Div>
						<InfoRow title="Цель: ">
							<pre>
							 {this.state.message2user[2][1]}
						 </pre>
						</InfoRow>
					</Div>
					<Div>
						<InfoRow title="Рекомендация по планке: ">
							<pre>
							 {this.state.message2user[0][3]}
						 </pre>
						</InfoRow>
					</Div>
					<Div>
						<InfoRow title="Планка по шагам: ">
							 {this.state.message2user[2][3]}
						</InfoRow>
					</Div>
					<Div>
						<InfoRow title="Комментарий:">
							<pre>
							 {this.state.message2user[0][2]}
						 </pre>
						</InfoRow>
					</Div>
					<Div>
						<InfoRow title="Дата проверки:">
							 {this.state.message2user[2][2]}
						</InfoRow>
					</Div>
				</Div>
				:''}

        { this.state.registered==0 ?
		      <Div>
           <Button level="commerce" onClick={() =>this.setState({activePanel: 'newuser'})} >Регистрация</Button>
				</Div>
        :''}

        { !this.state.afterReg & this.state.registered==1 ?
        <Div>
         <Button level="commerce" onClick={() =>this.setState({activePanel: 'everyWeek'})} >Еженедельная анкета</Button>
      </Div>
        :''}

   </Panel>
	 <Panel id="everyWeek" theme="white">
     <PanelHeader>Еженедельный отчет</PanelHeader>

         <Div><InfoRow title="">
            Заполните данные за прошедшую неделю:
           </InfoRow>
 				</Div>
          <FormLayout id="form3">
            <Select top="Номер недели" placeholder="Не выбрана" name="weekNumber" value={Num($.weekNumber)} onChange={ChangeSt}>
                <option value="1">1 неделя</option>
                 <option value="2">2 неделя</option>
                 <option value="3">3 неделя</option>
                 <option value="4">4 неделя</option>
                 <option value="5">5 неделя</option>
                 <option value="6">6 неделя</option>
                 <option value="7">7 неделя</option>
                 <option value="8">8 неделя</option>
                 <option value="9">9 неделя</option>
                 <option value="10">10 неделя</option>
                 <option value="11">11 неделя</option>
                 <option value="12">12 неделя</option>
                 <option value="13">13 неделя</option>
                 <option value="14">14 неделя</option>
                 <option value="15">15 неделя</option>
								 <option value="16">16 неделя</option>
              </Select>
          <Input type="number" top="Средний вес за неделю (среднее арифметическое всех взвешиваний за неделю)" name="averageWeight" value={Num($.averageWeight)} step="0.1" onChange={ChangeSt}/>
          <Input type="number" top="Минимальный вес за неделю" name="minWeight" value={Num($.minWeight)} step="0.1" onChange={ChangeSt}/>
          <Input type="number" top="Среднее кол. шагов за неделю" name="averageStep" value={Num($.averageStep)} onChange={ChangeSt}/>
          <Select top="Тренировки (оцените по шкале от 1 до 5, где 1-не тренировались, 5 - активно тренировались)"
                placeholder="Ваша оценка"  name="rateTrainings"  value={Num($.rateTrainings)}  onChange={ChangeSt}>
               <option value="1">1</option>
               <option value="2">2</option>
               <option value="3">3</option>
               <option value="4">4</option>
               <option value="5">5</option>
             </Select>

          <Select top="Питание (оцените по шкале 1-5 насколько точно вы придерживались макросов и рекомендаций)"
                placeholder="Ваша оценка"  name="rateNutrition"  value={Num($.rateNutrition)}  onChange={ChangeSt}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Select>
            <Select top="Оцените уровень голода по шкале, где 1 - скорее постоянно сыт, чем голоден, а 5 - постоянно голоден:"
                  placeholder="Ваша оценка"  name="rateHunger"  value={Num($.rateHunger)}  onChange={ChangeSt}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Select>
					<Input top="Обхват шеи, см"  type="number" name="girthNeck" value={Num($.girthNeck)} step="0.1" onChange={ChangeSt}  />
					<Input top="Обхват талии, см"  type="number" name="girthWaist" value={Num($.girthWaist)} step="0.1" onChange={ChangeSt} />
					{this.state.formReg.sex=='1' ?
				            <Input  top="Обхват бедер, см"  type="number" name="girthHits" value={Num($.girthHits)} step="0.1" onChange={ChangeSt} />
				 	:''}
          { this.state.formReg.sex=='1' ?
      		          <Checkbox name="menses" value="да" checked={$.menses} onChange={ChangeSt} step="any">Были ли месячные на этой неделе? </Checkbox>
      		:''}

              <Checkbox name="foto" value="да" checked={$.foto} onChange={ChangeSt}>Отправляли свое фото нам? </Checkbox>
              <Textarea top="Комментарий по неделе" placeholder="" name="comment"  value={$.comment} onChange={ChangeSt}/>

              <Button level="commerce" onClick={() =>this.ajaxSend(1)}  >Отправить данные</Button>

        </FormLayout>

    </Panel>

   <Panel id="newuser" theme="white">
    <PanelHeader>Регистрация</PanelHeader>
    	 <Group>
        <Div><InfoRow title="Регистрация">
          Для регистрации просим ответить на несколько вопросов:
          </InfoRow>
			   </Div>
      </Group>
			<FormLayout id="form1">


			<Input top="Имя" name="first_name"  value={$.first_name} onChange={ChangeSt}/>
      <Input top="Фамилия" name="last_name" value={$.last_name} onChange={ChangeSt}/>

       <Select top="Пол" placeholder="Выберите пол"  name="sex" value={$.sex} onChange={ChangeSt}>
        <option value="2">Мужской</option>
        <option value="1">Женский</option>
      </Select>


	  <Select top="Цель" placeholder="Ваша цель" name="myTarget" value={$.myTarget} onChange={ChangeSt}>
        <option value="Похудение">Похудение</option>
        <option value="Реверс">Реверс</option>
        <option value="Набор массы">Набор массы</option>
      </Select>
       <Slider step={1} min={16} max={70} top={"Полных лет " + (($.old)?$.old:"") } name="old" value={$.old}  onChange={val =>{$['old']=val;this.setState({formReg: $})}} />

       <Input top="Рост" type="number" name="height" value={Num($.height)} onChange={ChangeSt} step="0.1" />
       <Input top="Вес" type="number"  name="weight" value={Num($.weight)}  step="0.1" onChange={ChangeSt}/>

	<Input top="Вид спорта (напр. кроссфит, футбол, танцы и т.д.)" name="sport"   value={$.sport} onChange={ChangeSt}/>
	<Input top="Количество дней с тренировками (в неделю)" name="dayssport" value={$.dayssport} onChange={ChangeSt} />
	  <Input top="Сколько минут (в среднем) длится одна тренировка" type="number" name="hoursport" value={Num($.hoursport)} onChange={ChangeSt} />


	  <Select top="Телосложение" placeholder="Тип фигуры" name="typefig" value={$.typefig} onChange={ChangeSt} >
        <option value="Эктоморф/Худощавый">Эктоморф/Худощавый</option>
        <option value="Мышечный/средний">Мышечный/средний</option>
        <option value="Эндоморф/полный">Эндоморф/полный</option>
      </Select>
		<Input top="Есть ли у Вас гормональные нарушения? Если нет - поставьте 'нет'" name="hormonalDisorder" value={$.hormonalDisorder} onChange={ChangeSt}/>

			<Div>
				<InfoRow title="Характер работы:" >
					<Radio value={v="1 офис"} 							name={n="typejob"} checked={$[n] === v} onChange={ChangeSt}>Малоподвижная (сидячая / офис)</Radio>
					<Radio value={v="2 легкая активность"} 	name={n="typejob"} checked={$[n] === v} onChange={ChangeSt}>Лёгкая активность/разъездная работа/весь день на ногах</Radio>
					<Radio value={v="3 лёгкий физ.труд"} 					name={n="typejob"} checked={$[n] === v} onChange={ChangeSt}>Активный - лёгкий физический труд (повара/парикмахеры)</Radio>
					<Radio value={v="4 тяжелый физ.труд"} 			name={n="typejob"} checked={$[n] === v} onChange={ChangeSt}>Тяжелый физический труд/строительные работы/грузчик</Radio>
				</InfoRow>
			</Div>
			<Div>
				<InfoRow title="Повседневная активность:" >
					<Radio value={v="1 минимальная"} 		name={n="dailyActivity"} checked={$[n] === v} onChange={ChangeSt}>Минимальная (сидячая/ноль движения)</Radio>
					<Radio value={v="2 ниже среднего"} 	name={n="dailyActivity"} checked={$[n] === v} onChange={ChangeSt}>Ниже среднего (прогулки/ ежедневный поход за покупками)</Radio>
					<Radio value={v="3 на ногах"} 			name={n="dailyActivity"} checked={$[n] === v} onChange={ChangeSt}>На ногах большую часть дня</Radio>
					<Radio value={v="4 легкиЙ руч.труд"} 		name={n="dailyActivity"} checked={$[n] === v} onChange={ChangeSt}>Легкий ручной труд</Radio>
					<Radio value={v="5 тяжелый руч.труд"} 	name={n="dailyActivity"} checked={$[n] === v} onChange={ChangeSt}>Тяжелый ручной труд</Radio>
				</InfoRow>
			</Div>
			<Div>
				<InfoRow title="Уровень стресса:" >
					<Radio value={v="1 без стресса"} 	name={n="stressLevel"} checked={$[n] === v} onChange={ChangeSt}>Без стресса (только переживаю очень во время просмотра новостей по телевизору)</Radio>
					<Radio value={v="2 по случаю"} 		name={n="stressLevel"} checked={$[n] === v} onChange={ChangeSt}>По случаю (например студент во время сессии)</Radio>
					<Radio value={v="3 средний"} 			name={n="stressLevel"} checked={$[n] === v} onChange={ChangeSt}>Средний (полноценная работа с дедлайнами и контактами с другими людьми)</Radio>
					<Radio value={v="4 высокий"} 			name={n="stressLevel"} checked={$[n] === v} onChange={ChangeSt}>Высокий (руководящая работа/жёсткий график/высокая ответственность)</Radio>
				</InfoRow>
			</Div>

		<Slider step={0.5} min={4} max={14} top={"Количество часов сна в среднем " + (($.sleep)?$.sleep:"") } value={Num($.sleep)} onChange={val =>{$['sleep']=val;this.setState({formReg: $})}} />


		 { this.state.formReg.myTarget=="Похудение" ?
       <Select top="Вы растолстели быстро (3-6 мес.) или вес/жир копился годами?" placeholder="Выберите"
				 name="fatquick" value={$.fatquick} onChange={ChangeSt}>
        <option value="Быстро">Быстро</option>
        <option value="Медленно">Медленно</option>
				<option value="Нет проблемы">Нет проблемы/я на массонабор</option>
      	</Select>: null }
      	 { this.state.formReg.myTarget=="Похудение" ?
      	<Select top="Были ли Вы в детстве полным ребенком?" placeholder="Выберите"
					name="fatchild" value={$.fatchild} onChange={ChangeSt}>
        <option value="Нет">Нет</option>
        <option value="Да">Да</option>
      	</Select> : null }
				{ this.state.formReg.sex=='1' ?
		          <Checkbox name="menses" value="да" checked={$.menses} onChange={ChangeSt}>Были ли месячные на этой неделе? </Checkbox>
		 					:''}

              <Checkbox name="foto" value="да" checked={$.foto} onChange={ChangeSt}>Отправляли свое фото нам? </Checkbox>

							<Div>
								 <InfoRow title="">
							 Измерьте свои характеристики согласно инструкциям на картинках
							 </InfoRow>
								 <FormLayout id="form2">
								 <InfoRow title="">
								 1) Измерь сантиметром окружность шеи в <b>самом узком</b> месте:
								 </InfoRow>
								<div style={{'textAlign': "center"}}>
									<br />
							{ this.state.formReg.sex=='1' ?
								 <img src={this.state.config.urlPhpServer+'img/w_neck.jpg'} width="60%" />
								 :	<img src={this.state.config.urlPhpServer+'img/m_neck.jpg'} width="60%" />
							 }<br /><br />
								</div>
								<Input top="Обхват шеи, см."  type="number" name="girthNeck" value={Num($.girthNeck)} step="any" onChange={ChangeSt}  />
								 <InfoRow title="">
								 2) Измерь сантиметром окружность талии - для женщин в <b>самом узком</b> месте, для мужчин <b>на уровне пупка</b>:
								 </InfoRow>
								<div style={{'textAlign': "center"}}>
									<br />
									{ this.state.formReg.sex=='1' ?
										<img src={this.state.config.urlPhpServer+'img/w_waist.jpg'} style={{'maxWidth':"60%"}}  />
										: <img src={this.state.config.urlPhpServer+'img/m_waist.jpg'} style={{'maxWidth':"60%", 'maxHeight':'400px'}}  />
										}
								<br /><br />
								</div>
								<Input top="Обхват талии, см."  type="number" name="girthWaist" value={Num($.girthWaist)} step="any" onChange={ChangeSt} />
							{ this.state.formReg.sex=='1' ?
							<div>
							<InfoRow title="">
							3) Измерь сантиметром окружность бедер в <b>самом широком</b> месте
							</InfoRow>
								<div style={{'textAlign': "center"}} >
									<br /><img src={this.state.config.urlPhpServer+'img/w_hips.jpg'} width="60%"  /><br /><br />

								 </div>
									<Input  top="Обхват бедер, см"  type="number" name="girthHits" value={Num($.girthHits)} step="any" onChange={ChangeSt} />
								 </div>
								 :''}
								<Div>
									<Button level="commerce" onClick={() =>this.ajaxSend(0)}  >Завершить регистрацию</Button>
							 </Div>
							</FormLayout>
							</Div>

    </FormLayout>
  </Panel>
  <Panel id="measurement" theme="white">
    <PanelHeader>Измерения</PanelHeader>

   </Panel>
</View>


		);
	}
}

export default App;
